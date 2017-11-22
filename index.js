'use strict';

const ioc = require('./lib/ioc');
const fs = require('fs');
const log = require('winston');

const FILE = './output.txt';
const productId = process.argv[2] || 'MLA620354952';

ioc.create('productService')
    .then(productService => {
        log.info(`Finding product ${productId}...`);
        return productService.findById(productId);
    })
    .then(product => {
        return ioc.create('paymentMethodService')
            .then(paymentMethodService => {
                log.info('Finding payment Methods...');
                return paymentMethodService.find();
            })
            .then(paymentMethods => {
                let output = `${product}\n`;

                for (const paymentMethod of paymentMethods) {
                    output += `${paymentMethod}\n`;
                }

                log.info(`Writing results to file "${FILE}"`);
                fs.writeFileSync(FILE, output);
            });
    })
    .catch(err => {
        log.error(err);
    });


