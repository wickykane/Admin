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
    const url = ['rma', 'create-rma'].join('/');
    return this.API.post(url, params);
  }

  getRMACode() {
    const url = ['bank/list?is_all=1'].join('/');
    return this.API.get(url);
  }

  getRMAType() {
    const url = ['bank/list?is_all=1'].join('/');
    return this.API.get(url);
  }

  getRMAReturnVia() {
    const url = ['bank/list?is_all=1'].join('/');
    return this.API.get(url);
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

  getOrderReferenve(id) {
    const url = ['bank/list?is_all=1', id].join('/');
    return this.API.get(url);
  }

  getReturnReason() {
    const url = ['bank/list?is_all=1'].join('/');
    return this.API.get(url);
  }
}
