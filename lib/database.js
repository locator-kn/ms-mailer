'use strict';
const mongo = require('mongodb').MongoClient;
const mongoUrl = 'mongodb://' + process.env['DB_HOST'] + ':' + process.env['DB_PORT'] + '/' + process.env['DB_NAME'];


const util = require('ms-utilities');
const log = util.logger;

const COLLECTION_USER = 'users';


const fns = {};
var database = {};

fns.findUserById = (userId) => {
    return fns.genericById(userId, COLLECTION_USER);
};

fns.findUserByMail = (mail) => {
    return database.collection(COLLECTION_USER)
        .find({mail: mail})
        .limit(-1)
        .next()
        .then(res => {
            if (!res) {
                log.error('No document found for', {collection: COLLECTION_USER, mail: mail});
                throw Error('not found');
            }
            return res;
        });

};

fns.genericById = (id, collectionId) => {
    return util.safeObjectId(id)
        .then(oId => {
            return database.collection(collectionId)
                .find({_id: oId})
                .limit(-1)
                .next()
                .then(res => {
                    if (!res) {
                        log.error('No document found for', {collection: collectionId, id: id});
                        throw Error('not found');
                    }
                    return res;
                });
        });
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