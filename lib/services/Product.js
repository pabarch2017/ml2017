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
                const product = this.createModel(resources);

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

    createModel(resource) {
        const product = new Product();

        product.id = resource.id || null;
        product.site_id = resource.site_id || null;
        product.title = resource.title || null;
        product.thumbnail = resource.thumbnail || null;
        product.price = resource.price || null;
        product.currency_id = resource.currency_id || null;
        product.available_quantity = resource.available_quantity || null;
        product.shipping_mode = resource.shipping && resource.shipping.mode || null;

        return product;
    }
}


module.exports = ProductService;
