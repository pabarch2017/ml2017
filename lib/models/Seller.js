'use strict';

class SellerModel {
    constructor() {
        this.id = null;
        this.nickname = null;
    }

    static create(resource) {
        const seller = new SellerModel();

        seller.id = resource.id || null;
        seller.nickname = resource.nickname || null;

        return seller;
    }
}


module.exports = SellerModel;


