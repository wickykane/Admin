import { Injectable } from '@angular/core';
import { ApiService } from '../../../services/api.service';

@Injectable()
export class WarehouseService {
    constructor(private API: ApiService) {}

    getListWarehouse(params) {
        // const url = 'warehouse/index';
        const url = 'warehouse/get-list';
        return this.API.get(url, params);
    }
    getDetailWarehouse(id) {
        const url = 'warehouse/get-detail/' + id;
        return this.API.get(url);
    }
    changeStatus(id, status) {
        const url = 'warehouse/setActive/' + id + '/' + status;
        return this.API.put(url);
    }
    setShipping(id) {
        const url = 'warehouse/setShippingOrigin/' + id;
        return this.API.put(url);
    }
}
