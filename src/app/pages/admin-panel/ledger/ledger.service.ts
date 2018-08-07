import { Injectable } from '@angular/core';
import { ApiService } from '../../../services/api.service';

@Injectable()
export class LedgerService {
    constructor(private apiService: ApiService) { }

    getListAccount(params) {
        const url = ['bank', 'list'].join('/');
        return this.apiService.get(url, params);
    }

    createAccount(params) {
        const url = ['bank'].join('/');
        return this.apiService.post(url, params);
    }

    updateAccount(id, params) {
        const url = ['bank', id].join('/');
        return this.apiService.put(url, params);
    }

    deleteAccount(id) {
        const url = ['bank', id].join('/');
        return this.apiService.delete(url);
    }

    getDetailAccount(id) {
        const url = ['bank', id].join('/');
        return this.apiService.get(url);
    }
}
