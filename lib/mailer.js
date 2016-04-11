'use strict';

const validation = require('./validation');
const mailgun = require('./mailgun');
const util = require('./util');

const _ = require('lodash');
const fs = require('fs');
const Joi = require('joi');
const path = require('path');

const PASSWORT_FORGOTTEN_MAIL_TEMPLATE = path.resolve(__dirname, './../template/passwordForget.html');

const log = require('ms-utilities').logger;

module.exports = {
    sendPwForgottenMail
};

function sendPwForgottenMail(message, next) {

    let seneca = this;

    Joi.validate(message.data, validation.passwordForgotten, (err, data) => {

        if (err) {
            return util.validationError(err, 'send password forgotten service', next);
        }

        seneca.act({
            role: 'user',
            cmd: 'getUser',
            by: 'mail',
            data: {
                mail: data.mail
            }
        }, (err, result) => {

            if (err || result.err) {
                log.warn(err || result);
                return next(err, result);
            }
            
            let user = result.data;

            renderMail(PASSWORT_FORGOTTEN_MAIL_TEMPLATE, {
                name: user.name,
                password: data.new_password,
                mail: user.mail
            })
                .then(mail => mailgun.sendMailToMailgun(user, mail, 'Ahoi ' + user.name + '!'))
                .then(() => next(null, {ok: true}))
                .catch(err => {
                    log.fatal('Unable to send password forgotten mail', {error: err});
                    return next(null, {err: {msg: 'MAIL_SEND_FAILED', detail: err}});
                });


        });

    });
}

function renderMail(mail, user) {
    return new Promise((resolve, reject) => {
        fs.readFile(mail, 'utf-8', (err, template) => {
            if (err) {
                return reject('Unable to read mail template');
            }

            let compiled = _.template(template);
            let renderedMail = compiled(user);

            resolve(renderedMail);

        });
    });
}
