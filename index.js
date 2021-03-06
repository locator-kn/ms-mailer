'use strict';

// load environment variables
const path = require('path');
const pwd = path.join(__dirname, '..', '/.env');
require('dotenv').config({path: pwd});

const seneca = require('seneca')();
const mailer = require('./lib/mailer');


// select desired transport method
//const transportMethod = process.env['SENECA_TRANSPORT_METHOD'] || 'rabbitmq';
const patternPin = 'role:mailer';

// init seneca and expose functions
seneca
//.use(transportMethod + '-transport')

//.client({type: 'tcp', port: 7010, host: 'localhost', pin: 'role:reporter'})

    .add(patternPin + ',cmd:send,subject:pwforget,', mailer.sendPwForgottenMail)
    .add(patternPin + ',cmd:send,subject:generic,', mailer.sendGenericMail)
 /*  .act({
        role: 'mailer',
        cmd: 'send',
        subject: 'pwforget',
        data: {
            mail: 'SteffenGorenflo@gmail.com',
            new_password: 'Steffen'
        }
    }, (err, data) => {
        console.log('Response from mailer');
        console.log(err, data);
    })*/
    //.listen({type: 'tcp', port: 7005, pin: patternPin})
    .use('mesh', {auto: true, pin: patternPin});
//.wrap(patternPin, util.reporter.report);

