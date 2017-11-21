'use strict';

const ProductService = require('../../../services/Product');

exports = module.exports = (apiClient, sellerService) => {
    return new ProductService(apiClient, sellerService);
};

exports['@singleton'] = true;
exports['@require'] = ['apiClient', 'sellerService'];
