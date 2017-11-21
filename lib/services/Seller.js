'use strict';

const log = require('winston');

class SellerService {
    constructor(apiClient) {
        this.apiClient = apiClient;
        this.basePath = '/users';
    }

    findById(id) {
        if (!id) {
            return Promise.reject(new Error('SellerService:findById() "id" param cannot be empty'));
        }

        const resourcePath = `${this.basePath}/${id}`;
        const options = {};
        const attributes = [
            'id',
            'nickname'
        ];

        options.attributes = attributes;

        log.debug('SellerService:findById() retrieving Seller', { id, options });

        return this.apiClient.get(resourcePath, options)
            .then(resource => {
                return resource;
            });
    }
}


module.exports = SellerService;
