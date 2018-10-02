import { Injectable } from '@angular/core';
import { ApiService } from '../../services/index';

@Injectable()
export class RMAService {

  constructor(private API: ApiService) { }

  getListRMA(params) {
    const url = ['rma', 'get-list'].join('/');
    return this.API.get(url, params);
  }

  getAllCustomer(params?) {
      const url = 'buyer/get-all';
      return this.API.get(url, params);
  }

  generateRMACode() {
    const url = ['rma', 'generate'].join('/');
    return this.API.get(url);
  }

  getRMATypeReference() {
    const url = ['rma', 'type'].join('/');
    return this.API.get(url);
  }

  getOrderReference() {
    const url = ['rma', 'sales-order-no'].join('/');
    return this.API.get(url);
  }

  getOrderReferenve(params) {
    const url = ['rma/create'].join('/');
    return this.API.post(url, params);
  }

}
