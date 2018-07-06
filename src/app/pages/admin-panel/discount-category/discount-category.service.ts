import { Injectable } from '@angular/core';
import { ApiService } from '../../../services/api.service';

@Injectable()
export class DiscountCategoryService {
    constructor(private API: ApiService) {}

    getListWarehouse(params) {
        const url = 'buyer/index';
        return this.API.get(url, params);
    }

    getListCategory() {
        const url = 'category';
        return this.API.get(url);
    }

    getListSubCategoryByCategory(id) {
        const url = 'category/sub' + id;
        return this.API.get(url);
    }
}
