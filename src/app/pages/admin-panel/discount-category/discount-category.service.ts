import { Injectable } from '@angular/core';
import { ApiService } from '../../../services/api.service';

@Injectable()
export class DiscountCategoryService {
    constructor(private API: ApiService) {}

    getListWarehouse(params) {
        // const url = 'warehouse/index';
        const url = 'buyer/index';
        return this.API.get(url, params);
    }
}
