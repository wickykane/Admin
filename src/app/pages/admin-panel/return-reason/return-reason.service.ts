import { Injectable } from '@angular/core';
import { ApiService } from '../../../services/api.service';

@Injectable()
export class ReturnReasonService {
    constructor(private apiService: ApiService) { }

    getListReturnReason(params) {
        const url = ['return-reason'].join('/');
        return this.apiService.get(url, params);
    }

    getDetailReturnReason(id) {
        const url = ['return-reason', id].join('/');
        return this.apiService.get(url);
    }

    createReturnReason(params) {
        const url = ['return-reason'].join('/');
        return this.apiService.post(url, params);
    }

    updateReturnReason(id, params) {
        const url = ['return-reason', id].join('/');
        return this.apiService.put(url, params);
    }

    deleteReturnReason(id) {
        const url = ['return-reason', id].join('/');
        return this.apiService.delete(url);
    }
    getGenerateCode() {
        const url = 'return-reason/generate-code';
        return this.apiService.get(url);
    }
}
