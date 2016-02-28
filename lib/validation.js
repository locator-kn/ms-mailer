'use strict';

const Joi = require('joi');

const validations = {};

validations.mongoId = Joi.string().optional();
validations.mongoIdRequired = Joi.string().required();

let basicDataWithUserData = Joi.object().keys({
    user_id: validations.mongoIdRequired
});

validations.passwordForgotten = basicDataWithUserData.keys({
    mail: Joi.string().email().min(3).max(60).required()
        .description('Mail address'),
    new_password: validations.mongoIdRequired
});

module.exports = validations;
