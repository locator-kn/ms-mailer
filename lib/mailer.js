'use strict';

const _ = require('lodash');
const fs = require('fs');
const Joi = require('joi');
const path = require('path');

const validation = require('./validation');
const mailgun = require('./mailgun');
const util = require('./util');
const service = require('./service');

const PASSWORT_FORGOTTEN_MAIL_TEMPLATE = path.resolve(__dirname, './../template/passwordForget.html');
const EASTER_ACTION_TEMPLATE = path.resolve(__dirname, './../template/easterAction.html');

const log = require('ms-utilities').logger;

module.exports = {
    sendPwForgottenMail,
    sendGenericMail
};

function sendPwForgottenMail(message, next) {

    let seneca = this;

    Joi.validate(message.data, validation.passwordForgotten, (err, data) => {

        if (err) {
            return util.validationError(err, 'send password forgotten service', next);
        }

        let user;
        service.getUserByMail(data.mail, seneca)
            .then(dbUser => {
                user = dbUser;
                return renderMail(PASSWORT_FORGOTTEN_MAIL_TEMPLATE, {
                    name: user.name,
                    password: data.new_password,
                    mail: user.mail
                })
            })
            .then(mail => mailgun.sendMailToMailgun(user, mail, 'Ahoi ' + user.name + '!'))
            .then(() => next(null, {ok: true}))
            .catch(err => {
                log.fatal('Unable to send password forgotten mail', {error: err});
                return next(null, {err: {msg: 'MAIL_SEND_FAILED', detail: err}});
            })
    });
}

function sendGenericMail(message, next) {

    Joi.validate(message.data, validation.mailAndName, (err, user) => {

        if (err) {
            return util.validationError(err, 'send easter mail service', next);
        }

        renderMail(EASTER_ACTION_TEMPLATE, {name: user.name})
            .then(mail => mailgun.sendMailToMailgun(user, mail, 'Ahoi ' + user.name + '!'))
            .then(() => next(null, {ok: true}))
            .catch(err => {
                log.fatal('Unable to send easter mail', {error: err});
                return next(null, {err: {msg: 'MAIL_SEND_FAILED', detail: err}});
            })
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
