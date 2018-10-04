import { Injectable } from '@angular/core';
import { ApiService } from '../../../services/index';

@Injectable()
export class RMAService {

  constructor(private API: ApiService) { }

  getListRMA(params) {
    const url = ['return-order', 'list'].join('/');
    return this.API.get(url, params);
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

  getListItemsFromOrder(orderId, params) {
      const url = `debit/orders/${orderId}/items`;
      return this.API.get(url, params);
  }

  listOrderByCompany(compnay_id) {
    const url = 'return-order/list-order-by-company/' + compnay_id;
    return this.API.get(url);
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

  getOrderReference() {
      const url = 'order/reference-data';
      return this.API.get(url);
  }

  getOrderDetail(id) {
      const url = ['order', id].join('/');
      return this.API.get(url);
  }

}
