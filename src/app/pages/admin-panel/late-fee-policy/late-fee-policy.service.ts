import { Injectable } from '@angular/core';
import { ApiService } from '../../../services/api.service';

@Injectable()
export class LateFeePolicyService {
    constructor(private apiService: ApiService) { }

    getListLateFeePolicyReference() {
        const url = 'invoice-policy/reference';
        return this.apiService.get(url);
    }

    getListLateFeePolicy(params) {
        const url = 'invoice-policy/get-list';
        return this.apiService.get(url, params);
    }

    createLateFeePolicy(params) {
        const url = 'invoice-policy/create';
        return this.apiService.post(url, params);
    }

    getGenerateCode() {
        const url = 'invoice-policy/generate-code';
        return this.apiService.get(url);
    }

    getDetailLateFeePolicy(id) {
        const url = 'invoice-policy/detail/' + id;
        return this.apiService.get(url);
    }

    updateLateFeePolicy(id, params) {
        const url = 'invoice-policy/update/' + id;
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

}
