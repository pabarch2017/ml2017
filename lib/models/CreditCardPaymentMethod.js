'use strict';

const PaymentMethod = require('./PaymentMethod');

class CreditCardPaymentMethod extends PaymentMethod {
    constructor() {
        super();
        this.max_installments = null;
    }

    toString() {
        return `${super.toString()},max_installments=${this.max_installments}`;
    }
}

module.exports = CreditCardPaymentMethod;
