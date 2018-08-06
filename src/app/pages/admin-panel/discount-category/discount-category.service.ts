import { Injectable } from '@angular/core';
import { ApiService } from '../../../services/api.service';

@Injectable()
export class DiscountCategoryService {
    constructor(private API: ApiService) { }

    getListDiscountCategory(params) {
        const url = 'category/discount/list';
        return this.API.get(url, params);
    }

    getListCategory() {
        const url = 'category/reference';
        return this.API.get(url);
    }

    generateCode() {
        const url = 'category/discount/generate-code';
        return this.API.get(url);
    }

    createDiscountCategory(params) {
        const url = 'category/discount/create';
        return this.API.post(url, params);
    }

    getDetailDiscountCategory(id) {
        const url = 'category/discount/detail/' + id;
        return this.API.get(url);
    }

    updatelDiscountCategory(id, params) {
        const url = 'category/discount/update/' + id;
        return this.API.put(url, params);
    }
}
