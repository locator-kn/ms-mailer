'use strict';

const mailgun = require('mailgun-js')({apiKey: process.env['MAILGUN_API_KEY'], domain: process.env['MAILGUN_DOMAIN']});
const LOCATOR_TEAM = 'Locator Team <team@' + process.env['MAILGUN_DOMAIN'] + '>';


const log = require('ms-utilities').logger;

const fns = {};

fns.sendMailToMailgun = (user, mail, subject) => {
    return new Promise((resolve, reject) => {
        
        let data = {
            from: LOCATOR_TEAM,
            to: user.mail,
            subject: subject,
            html: mail
        };

        // send mail
        mailgun.messages().send(data, err => {
            if (err) {
                log.error('Error while sending mail to ', user, ' Because of ', err);
                reject(err);
            }
            resolve();
        });
    });
};

module.exports = fns;