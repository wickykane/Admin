import { Injectable } from '@angular/core';
import { ApiService } from '../../../services/api.service';

@Injectable()
export class BankService {
    constructor(private apiService: ApiService) { }

    getListBank(params) {
        const url = ['buyer/index'].join('/');
        return this.apiService.get(url, params);
    }

    getDetailBank(id) {
        const url = ['bank', id].join('/');
        return this.apiService.get(url);
    }

    createBank(params) {
        const url = ['bank'].join('/');
        return this.apiService.post(url, params);
    }

    updateBank(params) {
        const url = ['bank'].join('/');
        return this.apiService.put(url, params);
    }

    deleteBank(id) {
        const url = ['bank', id].join('/');
        return this.apiService.delete(url);
    }
    getListCountry() {
        const url = 'country/admin/get-all';
        return this.apiService.get(url);
    }

    getStateByCountry(params) {
        const url = 'state/get-by-country';
        return this.apiService.get(url, params);
    }
}
