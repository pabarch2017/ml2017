'use strict';

const ioc = require('./lib/ioc');
const log = require('winston');

ioc.create('productService')
    .then(productService => {
        return productService.findById('MLA608969693');
    })
    .then(product => {
        log.info(product);
    })
    .catch(err => {
        log.error(err);
    });


