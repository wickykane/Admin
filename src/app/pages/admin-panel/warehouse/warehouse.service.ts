import { Injectable } from '@angular/core';
import { ApiService } from '../../../services/api.service';

@Injectable()
export class WarehouseService {
    constructor(private API: ApiService) {}

    getListWarehouse(params) {
        // const url = 'warehouse/index';
        const url = 'buyer/index';
        return this.API.get(url, params);
    }
    createWarehouse(data) {
        const url = 'warehouse/create';
        return this.API.postForm(url, data);
    }
    updateWarehouse(data) {
        const url = 'warehouse/update';
        return this.API.postForm(url, data);
    }
    getDetailWarehouse(id) {
        const url = 'warehouse/detail/' + id;
        return this.API.get(url);
    }
}
