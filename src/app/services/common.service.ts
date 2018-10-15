import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable()
export class CommonService {
    constructor(private apiService: ApiService) { }
    getListCountry() {
        const url = 'country/admin/get-all';
        return this.apiService.get(url);
    }

    getStateByCountry(params) {
        const url = 'state/get-by-country';
        return this.apiService.get(url, params);
    }

    getAllCustomer(params?) {
        const url = 'rma/get-all-customer';
        return this.apiService.get(url, params);
    }

    getDetailCustomer(id) {
        const url = 'rma/get-customer/' + id;
        return this.apiService.get(url);
    }

    getOrderByCustomer(id) {
        const url = 'rma/get-order-by-customer/' + id;
        return this.apiService.get(url);
    }

    getMasterData() {
        const url = 'rma/get-master-data';
        return this.apiService.get(url);
    }
    getCountryList() {
        const url = 'shipping-zone/list-country';
        return this.apiService.get(url);
    }

    getListCarrier(params = {}) {
        const url = 'carrier';
        return this.apiService.get(url, params);
    }

    getAllListBank() {
        const url = 'bank/list?is_all=1';
        return this.apiService.get(url);
    }
    getListBranchByBank(bank_id) {
        const url = 'bank/' + bank_id + '/branch/list?is_all=1';
        return this.apiService.get(url);
    }

    getOrderReference() {
        const url = 'order/reference-data';
        return this.apiService.get(url);
    }
    changeStatus(id) {
        const url = 'shipping-zone/change-status/' + id;
        return this.apiService.get(url);
    }
}
