'use strict';

class PaymentMethod {
    constructor() {
        this.id = null;
        this.name = null;
    }

    static create(resource) {
        const paymentMethod = new PaymentMethod();

        paymentMethod.id = resource.id || null;
        paymentMethod.name = resource.name || null;

        return paymentMethod;
    }
}

module.exports = PaymentMethod;
