import { Injectable } from '@angular/core';
import { ApiService } from '../../../services/api.service';

@Injectable()
export class InsuranceService {
    constructor(private apiService: ApiService) { }

    getListInsurance(params) {
        const url = ['buyer/index'].join('/');
        return this.apiService.get(url, params);
    }

    getListBranch(id, params) {
        const url = ['buyer/index'].join('/');
        return this.apiService.get(url, params);
    }

    getDetailInsurance(id) {
        const url = ['insurance', id].join('/');
        return this.apiService.get(url);
    }

    getDetailBranch(insuranceId, branchId) {
        const url = ['insurance', insuranceId, 'branch', branchId].join('/');
        return this.apiService.get(url);
    }

    createInsurance(params) {
        const url = ['insurance'].join('/');
        return this.apiService.post(url, params);
    }

    updateInsurance(params) {
        const url = ['insurance'].join('/');
        return this.apiService.put(url, params);
    }

    deleteInsurance(id) {
        const url = ['insurance', id].join('/');
        return this.apiService.delete(url);
    }

    createBranch(insuranceId, params) {
        const url = ['insurance', insuranceId, 'branch'].join('/');
        return this.apiService.post(url, params);
    }

    updateBranch(insuranceId, branchId, params) {
        const url = ['insurance', insuranceId, 'branch', branchId].join('/');
        return this.apiService.put(url, params);
    }

    deleteBranch(insuranceId, branchId) {
        const url = ['insurance', insuranceId, 'branch', branchId].join('/');
        return this.apiService.delete(url);
    }
}
