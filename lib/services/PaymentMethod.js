'use strict';

const PaymentMethod = require('../models/PaymentMethod');
const CreditCardPaymentMethod = require('../models/CreditCardPaymentMethod');
const log = require('winston');

class PaymentMethodService {
    constructor(apiClient) {
        this.apiClient = apiClient;
        this.basePath = '/sites/MLA/payment_methods';
    }

    find(ids) {
        if (ids && !Array.isArray(ids)) {
            return Promise.reject(new Error('PaymentMethodService:find() "ids" param must be an array'));
        }

        /*
        const options = {};
        // attributes param does not work when it contains "payment_type_id" attribute
        options.attributes = [
            'id',
            'name',
            'payment_type_id'
        ];

        // ids attributes does not work
        if (ids) options.ids = ids;
        */

        const options = {};

        log.debug('PaymentMethodService:find() retrieving PaymentMethods', options);

        return this.apiClient.get(this.basePath, options)
            .then(resources => {
                const promises = [];

                for (const resource of resources) {
                    promises.push(this.findById(resource.id));
                }

                return Promise.all(promises)
                    .then(paymentMethods => {
                        return paymentMethods;
                    });
            });
    }

    findById(id) {
        if (!id) {
            return Promise.reject(new Error('PaymentMethodService:findById() "id" param cannot be empty'));
        }

        const resourcePath = `${this.basePath}/${id}`;
        const options = {};

        options.attributes = [
            'id',
            'name',
            'payment_type_id',
            'payer_costs'
        ];

        log.debug('PaymentMethodService:findById() retrieving PaymentMethod', { id, options });

        return this.apiClient.get(resourcePath, options)
            .then(resource => {
                if (resource.payment_type_id === 'credit_card') {
                    return CreditCardPaymentMethod.create(resource);
                }
                else {
                    return PaymentMethod.create(resource);
                }
            });
    }
}


module.exports = PaymentMethodService;
