'use strict';

const PaymentMethod = require('./PaymentMethod');

class CreditCardPaymentMethod extends PaymentMethod {
    constructor() {
        super();
        this.maxInstallments = null;
    }
}

module.exports = CreditCardPaymentMethod;
