import { Injectable } from '@angular/core';
import { ApiService } from '../../../services/api.service';

@Injectable()
export class EPIPolicyService {
    constructor(private apiService: ApiService) { }

    getListEPIPolicyReference() {
        const url = 'invoice-payment-policy/reference';
        return this.apiService.get(url);
    }

    getListEPIPolicy(params) {
        const url = 'invoice-payment-policy/get-list';
        return this.apiService.get(url, params);
    }

    createEPIPolicy(params) {
        const url = 'invoice-payment-policy/create';
        return this.apiService.post(url, params);
    }

    getGenerateCode() {
        const url = 'invoice-payment-policy/generate-code';
        return this.apiService.get(url);
    }

    getDetailEPIPolicy(id) {
        const url = 'invoice-payment-policy/detail/' + id;
        return this.apiService.get(url);
    }

    updateEPIPolicy(id, params) {
        const url = 'invoice-payment-policy/update/' + id;
        return this.apiService.post(url, params);
    }

    getListCustomerType() {
        const url = 'buyer/type';
        return this.apiService.get(url);
    }

    getListCustomer(params) {
        const url = 'buyer/search';
        return this.apiService.get(url, params);
    }

    getListPaymentTerm() {
        const params = {
            page: 1,
            length: 100,
            order: 'id',
            sort: 'asc'
        };
        const url = ['payment-term'].join('/');
        return this.apiService.get(url, params);
    }

}
