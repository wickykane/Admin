import { Injectable } from '@angular/core';
import { ApiService } from '../../../services/index';

@Injectable()
export class CreditMemoService {

    constructor(private API: ApiService) { }

    getListCreditMemo(params) {
        const url = 'credit-memo/list';
        return this.API.get(url, params);
    }
    getListStatusCredit() {
        const url = ['credit-memo', 'status-list'].join('/');
        return this.API.get(url);
    }

    getListInvoiceItemsRef() {
        const url = 'ar-invoice/getItemInfo';
        return this.API.get(url);
    }

    getAllCustomer(params?) {
        const url = 'buyer/get-all';
        return this.API.get(url, params);
    }

    getDetailCompany(id) {
        const url = 'buyer/detail/' + id;
        return this.API.get(url);
    }

    getAllSaleOrderByCus(id) {
        const params = {'cus_id': id};
        const url = 'ar-invoice/get-list';
        return this.API.get(url, params);
    }

    getGenerateCode() {
        const url = 'credit-memo/master-data';
        return this.API.get(url);
    }

    getDetailInvoice(id) {
        const url = 'ar-invoice/' + id;
        return this.API.get(url);
    }
    getDetailCreditMemo(id) {
        const url = ['credit-memo', 'view', id].join('/');
        return this.API.get(url);
    }

    countCountStatus() {
        const url = 'credit-memo/status-list';
        return this.API.get(url);
    }

    createCreditMemo(params) {
        const url = 'credit-memo/create';
        return this.API.post(url, params);
    }

    updateInvoice(id, params) {
        const url = 'ar-invoice/updateInvoice/' + id;
        return this.API.put(url, params);
    }

    updateCreditStatus(params) {
        const url = 'credit-memo/change-status';
        return this.API.post(url, params);
    }

    deleteInvoice(id) {
        const url = 'ar-invoice/' + id;
        return this.API.delete(url);
    }

    getListPaymentTerm() {
        const url = ['payment-term?app=inv'];
        return this.API.get(url);
    }

    // getOrderByCustomerId(params) {
    //     const url = 'ar-invoice/get-order';
    //     return this.API.get(url, params);
    // }

    getListApprover() {
        const url = 'ar-invoice/get-list-user';
        return this.API.get(url);
    }
    printPDF(id) {
        const url = 'ar-invoice/export-invoice/' + id;
        return url;
    }
    getPaymentMethod() {
        const url = 'ar-invoice/get-payment-method';
        return this.API.get(url);
    }
    getListAccountGL() {
        const url = ['account', 'getAccountTree'].join('/');
        return this.API.get(url);
    }
    sendMail(id, params) {
        const url = 'credit-memo/send-email/' + id;
        return this.API.post(url, params);
    }
    reopenCredit(id) {
        const url = 'credit-memo/re-open/' + id;
        return this.API.get(url);
    }

    // Apply Credit For Invoice
    getDataForApplyById(credit_id) {
        const url = ['credit-apply', 'credit-detail', credit_id].join('/');
        return this.API.get(url);
    }
    getTableDataInvoiceById(customer_id, params) {
        const url = ['credit-apply', 'get-data', customer_id].join('/');
        return this.API.get(url, params);
    }
    applyCreditForInvoice(credit_id, params) {
        const url = ['credit-apply', 'apply', credit_id].join('/');
        return this.API.post(url, params);
    }
}
