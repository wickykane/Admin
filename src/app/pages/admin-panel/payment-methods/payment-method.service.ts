import { Injectable } from '@angular/core';
import { Http, RequestOptions, Response } from '@angular/http';
import { ApiService } from '../../../services/api.service';

@Injectable()
export class PaymentMethodsService {
    constructor(private $http: Http, private apiService: ApiService) {}

    getPaymentMethods(params) {
        const url = 'payment-method';
        return this.apiService.get(url, params);
    }

    getPaymentTypes() {
        const url = 'payment-method/payment-type';
        return this.apiService.get(url);
    }

    getPaymentProcessors() {
        const url = 'payment-method/payment-processor-type';
        return this.apiService.get(url);
    }

    getPaymentTransactionTypes() {
        const url = 'payment-method/payment-transaction-type';
        return this.apiService.get(url);
    }

    getPaymentMethodDetail(id) {
        const url = 'payment-method/' + id;
        return this.apiService.get(url);
    }

    checkDupliateDisplayName(params) {
        const url = 'payment-method/validate/name';
        return this.apiService.post(url, params);
    }

    createPaymentMethod(params) {
        const url = 'payment-method';
        return this.apiService.post(url, params);
    }

    editPaymentMethod(id, params) {
        const url = 'payment-method/' + id;
        return this.apiService.put(url, params);
    }

    deletePaymentMethod(id) {
        const url = 'payment-method/' + id;
        return this.apiService.delete(url);
    }
}
