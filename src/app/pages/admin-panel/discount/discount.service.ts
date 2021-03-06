import { Injectable } from '@angular/core';
import { ApiService } from '../../../services/api.service';

@Injectable()
export class DiscountService {
    constructor(private API: ApiService) {}

    saveDiscount(data) {
        const url = 'discount/create';
        console.log(data);
        return this.API.postForm(url, data);
    }
    saveEditDiscount(data) {
        const url = 'discount/edit';
        return this.API.postForm(url, data);
    }

    getListType() {
        const url = 'discount/list-type/';
        return this.API.get(url);
    }
    getListDiscounts(params) {
        const url = 'discount/list-all';
        // const url = 'buyer/index';
        return this.API.get(url, params);
    }
    getDetailDiscount(id) {
        // const url = 'discount/detail/' + id;
        const url = 'buyer/index';
        return this.API.get(url);
    }
}
