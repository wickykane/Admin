import { Injectable } from '@angular/core';
import { ApiService } from '../../services/index';

@Injectable()
export class OrderService {

    constructor(private ApiService: ApiService) { }
    //Buyer RFQ
    getListBuyerRFQ(params) {
        let url = 'rfq';
        return this.ApiService.get(url, params);
    }

    //Order
    getListOrder(params) {
        let url = 'order/list-order';
        return this.ApiService.get(url, params);
    }

    getListStatus() {
        let url = 'order/list-status';
        return this.ApiService.get(url);
    }

    countOrderStatus() {
        let url = 'reports/order-status-count';
        return this.ApiService.get(url);
    }

    getListItemById(params) {
        var url = 'product/list-product-to-order';
        return this.ApiService.get(url, params);
    }

    createOrder(params) {
        var url = 'order/create-order';
        return this.ApiService.post(url, params);
    }

    getOrderNumber(id) {
        var url = ['order', 'generate-order-number', id].join('/');
        return this.ApiService.get(url);
    }

    getStatisticalOrder(params) {
        var url = 'order/statistical-order';
        return this.ApiService.get(url, params);
    }

    approveOrd(ordId) {
        var url = 'order/approved/' + ordId;
        return this.ApiService.put(url);
    }

    cancelOrd(ordId) {
        var url = 'order/cancel/' + ordId;
        return this.ApiService.put(url);
    }
    sendEmail(params) {
        var url = 'order/sent-message';
        return this.ApiService.put(url, params);
    }
    generateSO() {
        var url = 'order/get-order-code';
        return this.ApiService.get(url);
    }
    getHistoryByCode(code) {
        var url = "order/history?order_cd=" + code;
        return this.ApiService.get(url);
    }
    getInvoice(id) {
        var url = "order/invoice/" + id;
        return this.ApiService.get(url);
    }
    previewOrder(params) {
        var url = 'order/preview-order';
        return this.ApiService.post(url, params);
    }
    cloneOrder(order_id) {
        var url = 'order/clone-order/' + order_id;
        return this.ApiService.post(url);
    }
}