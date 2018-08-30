import { Injectable } from '@angular/core';
import { ApiService } from '../../../services/index';

@Injectable()
export class CreditMemoService {

    constructor(private API: ApiService) { }

    getListInvoice(params) {
        // const url = 'ar-invoice';
        // return this.API.get(url, params);
        const url = 'ar-invoice/get-list';
        return this.API.get(url, params);
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

    getGenerateCode() {
        const url = 'ar-invoice/general-code';
        return this.API.get(url);
    }

    getDetailInvoice(id) {
        const url = 'ar-invoice/' + id;
        return this.API.get(url);
    }

    countInvoiceStatus() {
        // const url = 'ar-invoice/count-by-status';
        const url = 'ar-invoice/count-status';
        return this.API.get(url);
    }

    createInvoice(params) {
        const url = 'ar-invoice/createInvoice';
        return this.API.post(url, params);
    }

    updateInvoice(id, params) {
        const url = 'ar-invoice/updateInvoice/' + id;
        return this.API.put(url, params);
    }

    updateInvoiceStatus(id, params) {
        const url = 'ar-invoice/change-status/' + id;
        return this.API.put(url, params);
    }

    deleteInvoice(id) {
        const url = 'ar-invoice/' + id;
        return this.API.delete(url);
    }

    getListPaymentTerm() {
        const url = ['payment-term?app=inv'];
        return this.API.get(url);
    }

    getOrderByCustomerId(params) {
        const url = 'ar-invoice/get-order';
        return this.API.get(url, params);
    }    

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
}
