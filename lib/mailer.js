'use strict';

const db = require('./database');
const validation = require('./validation');
const mailgun = require('./mailgun');
const util = require('./util');

const _ = require('lodash');
const fs = require('fs');
const Joi = require('joi');
const path = require('path');

const PASSWORT_FORGOTTEN_MAIL_TEMPLATE = path.resolve(__dirname, './../template/passwordForget.html');

const log = require('ms-utilities').logger;

const fns = {};


fns.sendPwForgottenMail = (message, next) => {

    Joi.validate(message.data, validation.passwordForgotten, (err, data) => {

        if (err) {
            return util.validationError(err, 'send password forgotten service', next);
        }

        let user = {};

        db.findUserById(data.user_id)
            .then(dbUser => {

                user = dbUser;

                return fns.renderMail(PASSWORT_FORGOTTEN_MAIL_TEMPLATE, {
                    name: dbUser.name,
                    password: data.new_password,
                    mail: dbUser.mail
                });
                
            })
            .then(mail => mailgun.sendMailToMailgun(user, mail, 'Ahoi ' + user.name + '!'))
            .then(() => next(null, {ok: true}))
            .catch(err => {
                log.fatal('Unable to send password forgotten mail', {error: err});
                return next(null, {err: {msg: 'MAIL_SEND_FAILED', detail: err}});
            });

    });

};

fns.renderMail = (mail, user) => {
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
};


module.exports = fns;