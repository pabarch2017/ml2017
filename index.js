'use strict';

const ioc = require('./lib/ioc');

ioc.create('apiClient')
    .then(apiClient => {
        return apiClient.get('/sites/MLA/payment_methods/visa', { attributes: ['id'] });
    })
    .then(response => {
        console.log(response);
    })
    .catch(e => {
        console.log(e);
    });


