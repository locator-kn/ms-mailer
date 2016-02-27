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

            .add(patternPin + ',cmd:send,subject:pwforget,', mailer.sendPwForgottenMail)
            /*.act({
                role: 'mailer',
                cmd: 'send',
                subject: 'pwforget',
                data: {
                    user_id: '569e464b4e6e2db462de2a8c',
                    new_password: 'waaas'
                }
            }, (err, data) => {
                console.log('Response from mailer');
                console.log(err, data);
            })*/
            .listen({type: 'tcp', port: 7005, pin: patternPin})
            .wrap(patternPin, util.reporter.report);
    });
