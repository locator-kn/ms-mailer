'use strict';
const mongo = require('mongodb').MongoClient;
const mongoUrl = 'mongodb://' + process.env['DB_HOST'] + ':' + process.env['DB_PORT'] + '/' + process.env['DB_NAME'];


const util = require('ms-utilities');
const log = util.logger;


const fns = {};
var database = {};

/**
 * gets all users from the database
 * @param message - some param
 * @returns {*}
 */
fns.getAllUsers = (message) => {
    if (message.cmd !== 'test') {
        return Promise.reject({message: 'cmd was not test', code: 4000});
    }
    return Promise.resolve({doc: 'asd', processId: process.pid});
};

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