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

}
