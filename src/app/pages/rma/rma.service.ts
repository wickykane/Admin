import {Injectable} from '@angular/core';
import { ApiService } from '../../services/index';

@Injectable()
export class RmaService {

  constructor(private API: ApiService) {  }
  getAllSts(params) {
    let url = ['reports', 'get-all-orders-status'].join('/');
    return this.API.get(url, params);
  }

  getRMAInfo() {
    let url = ['rma', 'generate'].join('/');
    return this.API.get(url);
  }

  getListOrders() {
    let url = ['reference', 'order'].join('/');
    return this.API.get(url);
  }
  getOrderById(id) {
    let url = ['reference', 'order', id, 'items'].join('/');
    return this.API.get(url);
  }
  createRMA(params) {
    let url = ['rma', 'create-rma'].join('/');
    return this.API.post(url, params);
  }

}
