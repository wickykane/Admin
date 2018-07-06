import { Injectable } from '@angular/core';
import { ApiService } from '../../../services/api.service';

@Injectable()
export class DiscountService {
    constructor(private API: ApiService) {}

    saveDiscount(data) {
        const url = 'discount/create';
        return this.API.postForm(url, data);
    }

    getListType() {
        const url = 'discount/list-type/';
        return this.API.get(url);
    }
    getListApplyType(data) {
        const url = 'discount/list-apply-type';
        return this.API.get(url, data);
    }
    getListSubCategory(data) {
        const url = 'discount/list-sub-category';
        return this.API.get(url, data);
    }
}
