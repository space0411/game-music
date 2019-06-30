module.exports = async function (req, res, next) {
    const invalidToken = sails.__('invalidToken');
    const wrongFormatToken = sails.__('wrongFormatToken');
    const wrongRole = sails.__('wrongRole');

    try {
        var token;

        if (req.headers && req.headers.authorization) {
            var parts = req.headers.authorization.split(' ');
            if (parts.length === 2) {
                var scheme = parts[0];
                var credentials = parts[1];

                if (/^Bearer$/i.test(scheme)) {
                    token = credentials;
                }
            } else {
                return res.status(401).json(Res.error(undefined, {
                    message: wrongFormatToken
                }));
            }
        } else if (req.params.token) {
            token = req.param('token');
            // We delete the token from param to not mess with blueprintss
            delete req.query.token;
        } else {
            return res.status(401).json(Res.error(undefined, {
                message: invalidToken
            }));
        }
        //Find and delete invalid token
        await JwtToken.destroy({ owner: null });
        // looking token in list of token in db and veryfi it (Active-(isLogout))
        var foundJwtToken = await JwtToken.findOne({
            token: token,
            isActive: true
        }).populate('owner');
        if (!foundJwtToken) {
            return res.status(400).json(Res.error(undefined, {
                message: invalidToken
            }));
        } else {
            jwToken.verify(token, (err, decode) => {
                if (err) {
                    return res.status(401).json(Res.error(undefined, {
                        message: invalidToken
                    }));
                }
                if (!decode.user) {
                    return res.status(401).json(Res.error(undefined, {
                        message: invalidToken
                    }));
                } else {
                    console.log('Role', decode.user.role);
                    if (!decode.user.role === 'admin') {
                        return res.status(401).json(Res.error(undefined, {
                            message: wrongRole
                        }));
                    }
                }
                // console.log(foundJwtToken);
                req.user = foundJwtToken.owner;
                req.user.token = foundJwtToken.token;
                // console.log(req.user);
                return next();
            });
        }
    } catch (error) {
        console.error('error', error);
        switch (error.name) {
            case 'AdapterError':
                return res.status(400).json(Res.error(undefined, { message: sails.__('adapterError') }));
            default:
                return res.serverError(error);
        }
    }
};
