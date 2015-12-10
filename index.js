

const seneca = require('seneca')();
const mailer = require('./lib/mailer');
const database = require('./lib/database');

require('dotenv').config({path: '../.env'});

// select desired transport method
const transportMethod = process.env['SENECA_TRANSPORT_METHOD'] || 'rabbitmq';
const patternPin = 'role:mailer';

// init seneca and expose functions


database.connect()
    .then((db) => {
        seneca
            .use(transportMethod + '-transport')
            .add(patternPin + ',cmd:login', mailer.doSomething)
            .add(patternPin + ',cmd:else', mailer.doSomethingElse)
            .listen({type: transportMethod, pin: patternPin});
    });
