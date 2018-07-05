import { Injectable } from '@angular/core';
import { ApiService } from '../../../services/index';

@Injectable()
export class WarehourseService {
    constructor(private API: ApiService) {}

    getListWarehouse(params) {
        // const url = 'warehouse/index';
        const url = 'buyer/index';
        return this.API.get(url, params);
    }
}
