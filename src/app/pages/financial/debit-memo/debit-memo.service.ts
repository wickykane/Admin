import { Injectable } from '@angular/core';
import { ApiService } from '../../../services/index';

@Injectable()
export class DebitMemoService {

    constructor(private API: ApiService) { }

    getDebitReportTotal() {
        const url = 'debit/report/total';
        return this.API.get(url);
    }

    getListDebitMemo(params) {
        const url = 'debit';
        return this.API.get(url, params);
    }

    getDebitStatusList() {
        const url = 'debit/status';
        return this.API.get(url);
    }

    getAllCustomer(params?) {
        const url = 'buyer/get-all';
        return this.API.get(url, params);
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

    getListApprovers(params) {
        const url = 'user/search';
        return this.API.post(url, params);
    }

    getOrderInformation(orderId) {
        const url = 'debit/orders/' + orderId;
        return this.API.get(url);
    }

    getListBillOfCustomer(customerId) {
        const url = 'debit/buyers/' + customerId + '/billing-addresses';
        return this.API.get(url);
    }

    getListLineItems(orderId) {
        const url = 'debit/orders/' + orderId + '/items';
        return this.API.get(url);
    }

    getListItemsFromOrder(orderId, params) {
        const url = `debit/orders/${orderId}/items`;
        return this.API.get(url, params);
    }

    getListItemsFromMisc(orderId, params) {
        params['sts'] = 1;
        const url = 'misc';
        // const url = `debit/orders/${orderId}/items`;
        return this.API.get(url, params);
    }

    saveDebitMemo(params) {
        const url = 'debit';
        return this.API.post(url, params);
    }

    updateDebitMemo(debitId, params) {
        const url = 'debit/' + debitId;
        return this.API.put(url, params);
    }

    getDebitMemoDetail(debitId) {
        const url = 'debit/' + debitId;
        return this.API.get(url);
    }

    updateDebitMemoStatus(debitId, status) {
        const url = 'debit/' + debitId + '/status/' + status;
        return this.API.put(url);
    }

    sendMail(debitId, params) {
        const url = 'debit/' + debitId + '/send';
        return this.API.post(url, params);
    }
    getReceiptVoucher(debitId) {
        const url = 'debit/voucher/' + debitId;
        return this.API.get(url);
    }
    getDebitHistory(id) {
        const url = ['debit/history', id].join('/');
        return this.API.get(url);
    }
}
