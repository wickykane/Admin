import { Injectable } from '@angular/core';
import { ApiService } from '../../../services/api.service';

@Injectable()
export class ReturnReasonService {
    constructor(private apiService: ApiService) { }

    getListReturnReason(params) {
        const url = ['payment-term'].join('/');
        return this.apiService.get(url, params);
    }

    getDetailReturnReason(id) {
        const url = ['payment-term', id].join('/');
        return this.apiService.get(url);
    }

    createReturnReason(params) {
        const url = ['payment-term'].join('/');
        return this.apiService.post(url, params);
    }

    updateReturnReason(id, params) {
        const url = ['payment-term', id].join('/');
        return this.apiService.put(url, params);
    }

    deleteReturnReason(id) {
        const url = ['payment-term', id].join('/');
        return this.apiService.delete(url);
    }
}
