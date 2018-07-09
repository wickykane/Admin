import { Injectable } from '@angular/core';
import { ApiService } from '../../../services/api.service';

@Injectable()
export class BankService {
    constructor(private apiService: ApiService) { }

    getListBank(params) {
        const url = ['bank', 'list'].join('/');
        return this.apiService.get(url, params);
    }

    getListBranch(id, params) {
        const url = ['bank', id, 'branch', 'list'].join('/');
        return this.apiService.get(url, params);
    }

    getDetailBank(id) {
        const url = ['bank', id].join('/');
        return this.apiService.get(url);
    }

    getDetailBranch(bankId, branchId) {
        const url = ['bank', bankId, 'branch', branchId].join('/');
        return this.apiService.get(url);
    }

    createBank(params) {
        const url = ['bank'].join('/');
        return this.apiService.post(url, params);
    }

    updateBank(id, params) {
        const url = ['bank', id].join('/');
        return this.apiService.put(url, params);
    }

    deleteBank(id) {
        const url = ['bank', id].join('/');
        return this.apiService.delete(url);
    }

    createBranch(bankId, params) {
        const url = ['bank', bankId, 'branch'].join('/');
        return this.apiService.post(url, params);
    }

    updateBranch(bankId, branchId, params) {
        const url = ['bank', bankId, 'branch', branchId].join('/');
        return this.apiService.put(url, params);
    }

    deleteBranch(bankId, branchId) {
        const url = ['bank', bankId, 'branch', branchId].join('/');
        return this.apiService.delete(url);
    }
}
