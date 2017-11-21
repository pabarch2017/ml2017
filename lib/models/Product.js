'use strict';

class ProductModel {
    constructor() {
        this.id = null;
        this.site_id = null;
        this.title = null ;
        this.thumbnail = null;
        this.price = null;
        this.currency_id = null;
        this.available_quantity = null;
        this.shipping_mode = null;
        this.seller = null;
    }

    static create(resource) {
        const product = new ProductModel();

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


module.exports = ProductModel;

