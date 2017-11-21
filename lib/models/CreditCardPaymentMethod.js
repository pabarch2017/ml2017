'use strict';

const PaymentMethod = require('./PaymentMethod');

class CreditCardPaymentMethod extends PaymentMethod {
    constructor() {
        super();
        this.maxInstallments = null;
    }

    setMaxInstallmentsFromPayerCosts(payerCosts) {
        let installments = null;

        for (const payerCost of payerCosts) {
            if (payerCost.installments > installments) {
                installments = payerCost.installments;
            }
        }

        this.maxInstallments = installments;
    }

    static create(resource) {
        const paymentMethod = new CreditCardPaymentMethod();

        paymentMethod.id = resource.id || null;
        paymentMethod.name = resource.name || null;
        paymentMethod.setMaxInstallmentsFromPayerCosts(resource.payer_costs);

        return paymentMethod;
    }
}

module.exports = CreditCardPaymentMethod;
