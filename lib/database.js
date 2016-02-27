'use strict';
const mongo = require('mongodb').MongoClient;
const mongoUrl = 'mongodb://' + process.env['DB_HOST'] + ':' + process.env['DB_PORT'] + '/' + process.env['DB_NAME'];


const util = require('ms-utilities');
const log = util.logger;


const fns = {};
var database = {};

/**
 * connects to the database
 * @returns {Promise|*}
 */

fns.connect = () => {
    return mongo.connect(mongoUrl)
        .then(db => {
            database = db;
            log.info('Connected to mongodb');
        })
        .catch(err => {
            log.error(err, 'Failed connecting to mongodb or failed ensuring index ');
        });
};


module.exports = fns;