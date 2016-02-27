'use strict';

const db = require('./database');
const validation = require('./validation');
const util = require('./util');

var _ = require('lodash');
var fs = require('fs');
const Joi = require('joi');


const fns = {};

/**
 * Returns nothing, nothing
 * @returns {string} - nothing
 * @private
 */
function _anything() {
    return 'nothing';
}

/**
 * This function does something, sometimes
 * @param message - some data from outside
 * @param next - callback function - to be called in node-style: (err, message)
 * @returns {Promise.<T>}
 */
fns.doSomething = (message, next) => {

    return db.getAllUsers(message)
        .then(data => {
            next(null, {doc: 'asd', processId: process.pid});
        }).catch(err => {
            return next({message: 'cmd was not test', code: 4000});
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