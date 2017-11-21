'use strict';

const ioc = require('./lib/ioc');
const log = require('winston');

ioc.create('paymentMethodService')
    .then(productService => {
        return productService.find();
    })
    .then(product => {
        log.info(product);
    })
    .catch(err => {
        log.error(err);
    });


