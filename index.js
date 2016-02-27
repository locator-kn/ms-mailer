'use strict';

const path = require('path');
const pwd = path.join(__dirname, '..', '/.env');
require('dotenv').config({path: pwd});

const seneca = require('seneca')();
const mailer = require('./lib/mailer');
const util = require('ms-utilities');
const database = require('./lib/database');


// select desired transport method
//const transportMethod = process.env['SENECA_TRANSPORT_METHOD'] || 'rabbitmq';
const patternPin = 'role:mailer';

// init seneca and expose functions


database.connect()
    .then(() => {
        seneca
        //.use(transportMethod + '-transport')

            .client({type: 'tcp', port: 7010, host: 'localhost', pin: 'role:reporter'})

            .add(patternPin + ',cmd:send,subject:pwforget,', mailer.sendMail)


            .listen({type: 'tcp', port: 7002, pin: patternPin})
            .wrap(patternPin, util.reporter.report);
    });
