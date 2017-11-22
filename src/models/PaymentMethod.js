'use strict';

class PaymentMethod {
    constructor() {
        this.id = null;
        this.name = null;
    }

    toString() {
        return `${this.constructor.name}:id=${this.id},name=${this.name}`;
    }
}

module.exports = PaymentMethod;
