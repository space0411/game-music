module.exports = {
    // send Welcome Mail
    sendWelcomeMail: (obj) => {
        sails.hooks.email.send(
            'welcomeEmail',
            {
                Name: obj.name,
                OTP: obj.otp,
                Email: obj.email
            },
            {
                to: obj.email,
                subject: '[Mgame] Email verification required'
            }, (err) => { console.log(err || 'Wellcome Mail Sent!'); }
        );
    },
    // send Forgot Password
    sendForgotPassword: (obj) => {
        sails.hooks.email.send(
            'forgotPassword',
            {
                Name: obj.name,
                Email: obj.email,
                NewPassword: obj.newPassword,
                URL: obj.url
            },
            {
                to: obj.email,
                subject: '[Mgame] Please reset your password'
            }, (err) => { console.log(err || 'Forgot password Mail Sent!'); }
        );
    }
};
