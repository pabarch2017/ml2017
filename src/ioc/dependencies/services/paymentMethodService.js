'use strict';

const PaymentMethod = require('../../../services/PaymentMethod');

exports = module.exports = apiClient => {
    return new PaymentMethod(apiClient);
};

exports['@singleton'] = true;
exports['@require'] = ['apiClient'];

