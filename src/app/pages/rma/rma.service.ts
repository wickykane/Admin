import { Injectable } from '@angular/core';
import { ApiService } from '../../services/index';

@Injectable()
export class RmaService {

  constructor(private API: ApiService) { }
  getAllSts(params) {
    const url = ['reports', 'get-all-orders-status'].join('/');
    return this.API.get(url, params);
  }

  getRMAInfo() {
    const url = ['rma', 'generate'].join('/');
    return this.API.get(url);
  }

  getListOrders() {
    const url = ['reference', 'order'].join('/');
    return this.API.get(url);
  }

  getOrderById(id) {
    const url = ['reference', 'order', id, 'items'].join('/');
    return this.API.get(url);
  }

  createRMA(params) {
    const url = ['rma', 'create'].join('/');
    return this.API.customPost(url, params);
  }

  getRefundMethod() {
    const url = ['bank/list?is_all=1'].join('/');
    return this.API.get(url);
  }

  getPaymentTerm() {
    const url = ['bank/list?is_all=1'].join('/');
    return this.API.get(url);
  }

  getApprover() {
    const url = ['bank/list?is_all=1'].join('/');
    return this.API.get(url);
  }

  getOrderReferenve(params) {
    const url = ['rma/create'].join('/');
    return this.API.post(url, params);
  }
  getOrderInfo(id) {
    const url = 'rma/get-info-order/'+id;
    return this.API.get(url,null);
  }

  getReturnReason() {
    const url = ['bank/list?is_all=1'].join('/');
    return this.API.get(url);
  }
}
