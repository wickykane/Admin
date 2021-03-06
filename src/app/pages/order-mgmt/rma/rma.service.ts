import { Injectable } from '@angular/core';
import { ApiService } from '../../../services/index';

@Injectable()
export class RMAService {

    constructor(private API: ApiService) { }

    getListRMA(params) {
        const url = ['return-order', 'list'].join('/');
        return this.API.get(url, params);
    }

    getDetailRMA(id, flag) {
        const str = flag ? '?is_edit=0' : '?is_edit=1';
        const url = 'return-order/view/' + id + str;
        return this.API.get(url);
    }

    getAllCustomer(params?) {
        const url = 'buyer/get-all';
        return this.API.get(url, params);
    }

    getRMAMasterData() {
        const url = ['return-order', 'master-data'].join('/');
        return this.API.get(url);
    }

    getDetailCompany(id) {
        const url = 'buyer/detail/' + id;
        return this.API.get(url);
    }

    getRMAReference() {
        const url = 'return-order/reference';
        return this.API.get(url);
    }

    listOrderByCompany(params) {
        const url = 'return-order/list-order-by-company';
        return this.API.post(url, params);
    }

    listInvoiceByOrder(order_id) {
        const url = 'return-order/list-invoice-by-order/' + order_id;
        return this.API.get(url);
    }

    checkDateTime(params) {
        const url = 'return-order/check-date-time';
        return this.API.post(url, params);
    }

    createReturnOrder(params) {
        const url = 'return-order/create';
        return this.API.post(url, params);
    }

    updateReturnOrder(params, id) {
        const url = 'return-order/update/' + id;
        return this.API.put(url, params);
    }

    getOrderReference() {
        const url = 'order/reference-data';
        return this.API.get(url);
    }

    getOrderDetail(id, return_id?) {
        const str = return_id ? '?return_order_id=' + return_id : '';
        const url = 'order/' + id + str;
        return this.API.get(url);
    }
    // change status return order
    updateStatus(params) {
        const url = ['return-order', 'change-status'].join('/');
        return this.API.post(url, params);
    }

    completeStatus(return_order_id) {
      const url = 'return-order/complete/' + return_order_id;
      return this.API.post(url);
    }

    updateChange(return_order_id) {
      const url = 'return-order/update-change/' + return_order_id;
      return this.API.post(url);
    }

    postItemsFromOrder(params) {
        const url = ['return-order', 'item-order '].join('/');
        return this.API.post(url, params);
    }

    getListApprover(params) {
        const url = 'user/search';
        return this.API.post(url, params);
    }


}
