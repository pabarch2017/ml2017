'use strict';

const ioc = require('./lib/ioc');
const log = require('winston');

ioc.create('paymentMethodService')
    .then(paymentMethodService => {
        return paymentMethodService.find();
    })
    .then(product => {
        log.info(product.toString());
    })
    .catch(err => {
        log.error(err);
    });


