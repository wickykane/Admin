import { Injectable } from '@angular/core';
import { ApiService } from '../../../services/api.service';

@Injectable()
export class PaymentTermService {
    constructor(private apiService: ApiService) { }

    getListPaymentTerm(params) {
        const url = ['payment-term'].join('/');
        return this.apiService.get(url, params);
    }

    getDetailPayment(id) {
        const url = ['payment-term', id].join('/');
        return this.apiService.get(url);
    }

    createPayment(params) {
        const url = ['payment-term'].join('/');
        return this.apiService.post(url, params);
    }

    updatePayment(params) {
        const url = ['payment-term'].join('/');
        return this.apiService.put(url, params);
    }

    deletePayment(id) {
        const url = ['payment-term', id].join('/');
        return this.apiService.delete(url);
    }
}
