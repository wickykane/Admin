import { Injectable } from '@angular/core';
import { ApiService } from '../../services/index';

@Injectable()
export class FinancialService {

    constructor(private API: ApiService) { }

    /**
     * AR INVOICE
     */
    //
    countOrderStatus() {
        const url = 'reports/order-status-count';
        return this.API.get(url);
    }

    getListStatus() {
        const url = 'order/list-status';
        return this.API.get(url);
    }

    getListInvoice(params) {
        const url = 'ar-invoice';
        return this.API.get(url, params);
    }

    getAllCustomer() {
        const url = 'buyer/get-all';
        return this.API.get(url);
    }

    getDetailCompany(id) {
        const url = 'buyer/detail/' + id;
        return this.API.get(url);
    }

    getOrderReference() {
        const url = 'order/reference-data';
        return this.API.get(url);
    }

    previewOrder(params) {
        const url = 'order/preview-order';
        return this.API.post(url, params);
    }

    createOrder(params) {
        const url = 'order/create-order';
        return this.API.post(url, params);
    }




}
