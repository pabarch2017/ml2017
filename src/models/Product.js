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

    toString() {
        return `Product:id=${this.id},site_id=${this.site_id},title="${this.title}",thumbnail=${this.thumbnail},price=${this.price}\
,currency_id=${this.currency_id},available_quantity=${this.available_quantity},shipping_mode=${this.shipping_mode},${this.seller}`;
    }
}

module.exports = ProductModel;
