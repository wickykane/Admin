import { Injectable } from '@angular/core';
import { ApiService } from '../../../services/api.service';

@Injectable()
export class DiscountService {
    constructor(private API: ApiService) {}

    getListDiscount(params) {
        // const url = 'Discount/index';
        const url = 'buyer/index';
        return this.API.get(url, params);
    }
    createDiscount(data) {
        const url = 'Discount/create';
        return this.API.postForm(url, data);
    }
    updateDiscount(data) {
        const url = 'Discount/update';
        return this.API.postForm(url, data);
    }
    getDetailDiscount(id) {
        const url = 'Discount/detail/' + id;
        return this.API.get(url);
    }
}
