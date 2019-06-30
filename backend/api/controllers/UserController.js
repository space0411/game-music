/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
var passport = require('passport');
var moment = require('moment');

module.exports = {
    /**
     * Signup user
     *
     * (POST /api/v1/user/signup)
     */
    signup: async (req, res) => {
        const data = req.body;
        // Disable Admin role register
        // if (data.role)
        //     data.role = 'user'
        // else
        //     data['role'] = 'user'
        console.log(data)
        try {
            let foundUser = await User.findOne({
                email: data.email
            });
            if (foundUser) {
                return res.status(400).json(Res.error(undefined, {
                    message: sails.__('emailAlreadyExist')
                }));
            }
            let createdUser = await User.create(data).fetch();
            if (createdUser) {
                // Create OTP
                const otpData = {
                    owner: createdUser.id
                };
                let createdOTP = await OTP.create(otpData).fetch();
                if (createdOTP) {
                    // Send a email to User
                    const emailData = {
                        email: createdUser.email,
                        name: createdUser.name,
                        otp: createdOTP.otp
                    };
                    Mailer.sendWelcomeMail(emailData);
                }
                return res.status(201).json(Res.success(createdUser, {
                    message: sails.__('registerSuccess')
                }));
            }

            return res.status(400).json(Res.error(undefined, {
                message: sails.__('registerFailed')
            }));

        } catch (error) {
            console.log(error);
            switch (error.name) {
                case 'UsageError':
                    return res.status(400).json(Res.error(undefined, { message: sails.__('invalidInput') }));
                case 'AdapterError':
                    return res.status(400).json(Res.error(undefined, { message: sails.__('adapterError') }));
                default:
                    return res.serverError(error);
            }
        }
    },

    /**
     * Create new OTP
     *
     * (POST /api/v1/user/newotp)
     */
    newotp: async (req, res) => {
        try {
            const createdUser = req.user;
            const otpData = {
                owner: createdUser.id
            };
            if (createdUser.activated) {
                return res.status(201).json(Res.success(undefined, {
                    message: sails.__('userWasActivated')
                }));
            }
            // delete old OTP with id user
            await OTP.destroy({ owner: createdUser.id });
            let createdOTP = await OTP.create(otpData).fetch();
            if (createdOTP) {
                // Send a email to User
                const emailData = {
                    email: createdUser.email,
                    name: createdUser.name,
                    otp: createdOTP.otp
                };
                Mailer.sendWelcomeMail(emailData);
            }
            return res.status(201).json(Res.success(undefined, {
                message: sails.__('registerSuccess')
            }));
        } catch (error) {
            console.log(error);
            switch (error.name) {
                case 'UsageError':
                    return res.status(400).json(Res.error(undefined, { message: sails.__('invalidInput') }));
                case 'AdapterError':
                    return res.status(400).json(Res.error(undefined, { message: sails.__('adapterError') }));
                default:
                    return res.serverError(error);
            }
        }
    },

    /**
    * Activate user
    *
    * (POST /api/v1/user/activate)
    */
    activate: async (req, res) => {
        const body = req.body;
        const id = body.id;
        const myOtp = body.otp;
        if (!id) {
            return res.status(403).json(Res.success(undefined, { message: sails.__('requiredUserId') }));
        }
        let updated = [];
        try {
            let foundOTP = await OTP.findOne({
                otp: myOtp,
                owner: id
            });
            if (!foundOTP) {
                return res.status(403).json(Res.error(undefined, {
                    message: sails.__('invalidOtp')
                }));
            }
            let expiredData = moment.unix(foundOTP.expireTime);
            let isSameOrBefore = moment().isSameOrBefore(expiredData);
            if (!isSameOrBefore) {
                return res.status(403).json(Res.error(undefined, {
                    message: sails.__('otpExpired')
                }));
            }

            updated = await User.update({ id: id }).set({ activated: true }).fetch();
        } catch (error) {
            switch (error.name) {
                case 'UsageError':
                    return res.status(400).json(Res.error(undefined, { message: sails.__('invalidInput') }));
                case 'AdapterError':
                    return res.status(400).json(Res.error(undefined, { message: sails.__('adapterError') }));
                default:
                    return res.serverError(error);
            }
        }

        return res.status(200).json(Res.success(updated[0], { message: sails.__('activeUserSuccess') }));
    },


    /**
    * Forgot pasword user
    * link was disable before => 5 min
    * (POST /api/v1/user/forgotpassword)
    */
    forgot: async (req, res) => {
        const body = req.body;
        const email = body.email;
        if (!email) {
            return res.status(403).json(Res.success(undefined, { message: sails.__('requiredEmail') }));
        }
        try {
            let foundUser = await User.findOne({
                email: email
            });
            if (!foundUser) {
                return res.status(400).json(Res.error(undefined, {
                    message: sails.__('userNotFound')
                }));
            }
            var randomPasword = Math.random().toString(36).slice(-8);
            var templateToken = {
                createdAt: foundUser.createdAt,
                email: foundUser.email,
                password: randomPasword
            };
            var token = jwToken.generate({
                user: templateToken
            }, 5 * 60); //=> 5 min

            const emailData = {
                email: foundUser.email,
                name: foundUser.name,
                newPassword: randomPasword,
                url: `http://localhost:1338/api/v1/user/config-forgot-password?token=${token}`
            };
            Mailer.sendForgotPassword(emailData);
        } catch (error) {
            switch (error.name) {
                case 'UsageError':
                    return res.status(400).json(Res.error(undefined, { message: sails.__('invalidInput') }));
                case 'AdapterError':
                    return res.status(400).json(Res.error(undefined, { message: sails.__('adapterError') }));
                default:
                    return res.serverError(error);
            }
        }

        return res.status(200).json(Res.success(undefined, { message: sails.__('newPasswordSend') }));
    },

    /**
     * Config Password change
     *
     * (GET /api/v1/user/config-forgot-password)
     */
    configForgotPassword: async (req, res) => {
        const token = req.param('token');
        if (!token) {
            return res.status(403).json(Res.success(undefined, { message: sails.__('requiredToken') }));
        }
        jwToken.verify(token, async (err, decode) => {
            if (err) {
                return res.status(401).json(Res.error(err, {
                    message: sails.__('invalidToken')
                }));
            }
            console.log('token', token);
            console.log('token decode', decode.user.password);
            const data = decode.user;
            try {
                let foundUser = await User.findOne({
                    email: data.email,
                    createdAt: data.createdAt
                });
                if (!foundUser)
                    return res.status(400).json(Res.error(undefined, {
                        message: sails.__('userNotFound')
                    }));
                await User.update({ id: foundUser.id }).set({ password: data.password }).fetch();
            } catch (error) {
                switch (error.name) {
                    case 'UsageError':
                        return res.status(400).json(Res.error(undefined, { message: sails.__('invalidInput') }));
                    case 'AdapterError':
                        return res.status(400).json(Res.error(undefined, { message: sails.__('adapterError') }));
                    default:
                        return res.serverError(error);
                }
            }
            return res.status(200).json(Res.success(undefined, { message: sails.__('newPasswordChanged') }));
        });
    },

    /**
     * Config Password change
     *
     * (POST /api/v1/user/password)
     */
    password: async (req, res) => {
        var body = req.body;
        var newPassword = body.password;
        if (!newPassword) {
            return res.status(403).json(Res.success(undefined, { message: sails.__('requiredPassword') }));
        }
        const data = req.user;
        if (!data)
            return res.status(400).json(Res.error(undefined, { message: sails.__('userNotFound') }));
        try {
            await User.update({ id: data.id }).set({ password: newPassword }).fetch();
        } catch (error) {
            switch (error.name) {
                case 'UsageError':
                    return res.status(400).json(Res.error(undefined, { message: sails.__('invalidInput') }));
                case 'AdapterError':
                    return res.status(400).json(Res.error(undefined, { message: sails.__('adapterError') }));
                default:
                    return res.serverError(error);
            }
        }
        return res.status(200).json(Res.success(undefined, { message: sails.__('newPasswordChanged') }));
    },
    /**
     * Login
     *
     * (POST /api/v1/user/login)
     */
    login: async (req, res) => {

        passport.authenticate('local', (err, user, info) => {
            console.log(err, user, info);
            if (err) {
                return res.status(403).json(Res.error(undefined, {
                    message: 'Something error.'
                }));
            }

            if (!user) {
                return res.status(401).json(Res.error(undefined, {
                    message: info.message
                }));
            }

            var templateToken = {
                'createdAt': user.createdAt,
                'updatedAt': user.updatedAt,
                'email': user.email,
                'id': user.id,
                'phone': user.phone,
                'name': user.name,
                'role': user.role
            };

            var token = jwToken.generate({
                user: templateToken
            }, sails.config.const.tokenLife);

            jwToken.verify(token, async (err, decode) => {
                if (err) {
                    return res.status(401).json(Res.error(undefined, {
                        message: sails.__('invalidToken')
                    }));
                }

                console.log('token', token);
                console.log('token decode', decode);
                const adata = {
                    token: token,
                    isActive: true,
                    issuedAt: decode.iat,
                    expireTime: decode.exp,
                    owner: user.id
                };
                await JwtToken.update({ owner: user.id, isActive: true }).set({ isActive: false }).fetch();
                let createdToken = await JwtToken.create(adata).fetch();
                console.log('createdToken', createdToken);
                let data = {
                    user: user,
                    token: token,
                    iat: decode.iat,
                    exp: decode.exp
                };

                return res.status(200).json(Res.success(data, {
                    message: sails.__('loginSuccess')
                }));


            });

        })(req, res);
    },

    /**
     * Logout user
     *
     * (GET /api/v1/user/logout)
     */
    logout: async (req, res) => {
        console.log(req.user.id);
        if (req.user) {
            var foundJwtToken = await JwtToken.findOne({
                owner: req.user.id,
                token: req.user.token,
                isActive: true
            });

            if (!foundJwtToken) {
                return res.status(400).json(Res.error(undefined, {
                    message: sails.__('didNotLoggedIn')
                }));
            }

            try {
                await JwtToken.update({
                    id: foundJwtToken.id
                }, { isActive: true }).set({ isActive: false }).fetch();
            } catch (error) {
                return res.status(400).json(Res.error(undefined, {
                    message: loggoutFailed
                }));
            }

            delete req.user;
            return res.status(200).json(Res.success(null, {
                message: sails.__('hasBeenLoggedOut')
            }));
        } else {
            return res.status(400).json(Res.error(undefined, {
                message: sails.__('didNotLoggedIn')
            }));
        }
    },

    /**
     * Delete user
     *
     * (DELETE /api/v1/user/delete)
     */
    delete: async (req, res) => {
        const body = req.body;
        const idRemove = body.id;
        if (!idRemove) {
            return res.status(403).json(Res.success(undefined, { message: sails.__('requiredUserId') }));
        }
        let deletedUser = [];
        try {
            deletedUser = await User.update({ id: idRemove }).set({ deletedAt: Date.now() }).fetch();
        } catch (error) {
            switch (error.name) {
                case 'UsageError':
                    return res.status(400).json(Res.error(undefined, { message: sails.__('invalidInput') }));
                case 'AdapterError':
                    return res.status(400).json(Res.error(undefined, { message: sails.__('adapterError') }));
                default:
                    return res.serverError(error);
            }
        }
        console.log('deletedSem', deletedUser.id);
        return res.status(200).json(Res.success(undefined, { message: sails.__('deleteUserSuccess') }));
    },

    /**
      * read User
      *
      * (POST /api/v1/user/read)
      */
    read: async (req, res) => {
        const body = req.body;

        let page = body.page || 1;
        let rowsOnPage = body.rowsOnPage || 20;

        let skip = (page - 1) * 20;
        let limit = rowsOnPage;
        let totalRows = 0;

        let foundTable = [];

        try {
            const temp = await User.find({
                where: { deletedAt: 0 }
            });
            totalRows = temp.length;
            console.log('totalRows', totalRows);
            foundTable = await User.find({
                where: { deletedAt: 0 },
                skip: skip,
                limit: limit,
                sort: 'id DESC'
            });
        } catch (error) {
            switch (error.name) {
                case 'UsageError':
                    return res.status(400).json(Res.error(undefined, { message: sails.__('invalidInput') }));
                case 'AdapterError':
                    return res.status(400).json(Res.error(undefined, { message: sails.__('adapterError') }));
                default:
                    return res.serverError(error);
            }
        }

        var outData = {
            page: parseInt(page),
            totalRows: totalRows,
            list: foundTable
        };
        return res.status(200).json(Res.success(outData, { message: sails.__('readUserSuccess') }));
    },
};
