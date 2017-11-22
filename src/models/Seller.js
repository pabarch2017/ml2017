'use strict';

class SellerModel {
    constructor() {
        this.id = null;
        this.nickname = null;
    }

    toString() {
        return `Seller:id=${this.id},nickname=${this.nickname}`;
    }
}

module.exports = SellerModel;
