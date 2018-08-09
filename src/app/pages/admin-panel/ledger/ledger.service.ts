import { Injectable } from '@angular/core';
import { ApiService } from '../../../services/api.service';

@Injectable()
export class LedgerService {
    constructor(private apiService: ApiService) { }

    getListAccount(id, params) {
        const url = ['account', id].join('/');
        return this.apiService.get(url, params);
    }

    getAccountTree() {
        const url = ['account', 'getTree'].join('/');
        return this.apiService.get(url);
    }

    getAccountTypeById(id) {
        const url = ['accountType', 'getDetail', id].join('/');
        return this.apiService.get(url);
    }

    getAccountCode() {
        const url = ['accountType', 'getCode'].join('/');
        return this.apiService.get(url);
    }

    createAccountType(params) {
        const url = ['accountType'].join('/');
        return this.apiService.post(url, params);
    }

    updateAccountType(id, params) {
        const url = ['accountType', id].join('/');
        return this.apiService.put(url, params);
    }

    createDetailAccountType(params) {
        const url = ['accountDetailType'].join('/');
        return this.apiService.post(url, params);
    }

    updateDetailAccountType(id, params) {
        const url = ['accountDetailType', id].join('/');
        return this.apiService.put(url, params);
    }

    getDetailAccountTypeById(id) {
        const url = ['accountDetailType', 'getDetail', id].join('/');
        return this.apiService.get(url);
    }

    getDetailAccountById(id) {
        const url = ['account', id].join('/');
        return this.apiService.get(url);
    }

    createAccount(id, params) {
        const url = ['account', id].join('/');
        return this.apiService.post(url, params);
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
