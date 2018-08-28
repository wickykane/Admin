import { Injectable } from '@angular/core';
import { ApiService } from '../../../services/index';

@Injectable()
export class DebitMemoService {

    constructor(private API: ApiService) { }

    getDebitReportTotal() {
        const url = 'debit/report/total';
        return this.API.get(url);
    }

    getDebitStatusList() {
        const url = 'debit/status';
        return this.API.get(url);
    }

    getListCustomer(name) {
        const url = 'debit/buyers?name=' + name;
        return this.API.get(url);
    }

    getCustomerContacts(customerId) {
        const url = 'debit/buyers/' + customerId + '/contacts';
        return this.API.get(url);
    }

    getDebitMemoNoAuto() {
        const url = 'debit/generate-number';
        return this.API.get(url);
    }

    getListOrder(customerId) {
        const url = 'debit/buyers/' + customerId + '/orders';
        return this.API.get(url);
    }

    getListPaymentMethods() {
        const url = 'debit/payment-methods';
        return this.API.get(url);
    }

    getListPaymentTerms() {
        const url = 'debit/payment-terms';
        return this.API.get(url);
    }

    getListSalePerson() {
        const url = 'debit/sale-persons';
        return this.API.get(url);
    }

    getListApprovers() {
        const url = 'debit/approvers';
        return this.API.get(url);
    }

    getOrderInformation(orderId) {
        const url = 'debit/orders/' + orderId;
        return this.API.get(url);
    }

    getListBillOfCustomer(customerId) {
        const url = 'debit/buyers/' + customerId + '/billing-address';
        return this.API.get(url);
    }

    getListLineItems(orderId) {
        const url = 'debit/orders/' + orderId + '/items';
        return this.API.get(url);
    }
}
