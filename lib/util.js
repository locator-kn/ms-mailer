'use strict';

const Hoek = require('hoek');

const util = require('ms-utilities');
const log = util.logger;

const fns = {};

fns.validationError = (err, service, next) => {
    log.error(err, 'Validation failed of' + service);
    return next(err);
};

fns.serviceError = (err, service, next) => {
    log.error(err, service + ' failed');
    return next(err);
};

fns.decorateNewDateData = (target) => {
    let isoDate = new Date().toISOString();
    return Hoek.merge(target, {
        create_date: isoDate,
        modified_date: isoDate
    });
};

fns.updateModifiedDate = (target) => {
    return Hoek.merge(target, {
        $currentDate: {
            modified_date: true
        }
    });
};


module.exports = fns;