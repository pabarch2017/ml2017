'use strict';

const log = require('winston');
const Product = require('../models/Product');

class ProductService {
    constructor(apiClient, sellerService) {
        this.apiClient = apiClient;
        this.sellerService = sellerService;
        this.basePath = '/items';
    }

    findById(id) {
        if (!id) {
            return Promise.reject(new Error('ProductService:findById() "id" param cannot be empty'));
        }

        const resourcePath = `${this.basePath}/${id}`;
        const options = {};

        options.attributes = [
            'id',
            'site_id',
            'title',
            'thumbnail',
            'price',
            'currency_id',
            'available_quantity',
            'shipping.mode',
            'seller_id'
        ];

        log.debug('ProductService:findById() retrieving Product', { id, options });

        return this.apiClient.get(resourcePath, options)
            .then(resources => {
                const product = Product.create(resources);

                if (resources.seller_id) {
                    return this.sellerService.findById(resources.seller_id)
                        .then(seller => {
                            product.seller = seller;
                            return product;
                        });
                }

                return product;
            });

    }
}


module.exports = ProductService;
