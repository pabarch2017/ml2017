'use strict';

const SellerService = require('../../../services/Seller');

exports = module.exports = apiClient => {
    return new SellerService(apiClient);
};

exports['@singleton'] = true;
exports['@require'] = ['apiClient'];
