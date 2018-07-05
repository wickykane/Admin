import { Injectable } from '@angular/core';
import { Http, RequestOptions, Response } from '@angular/http';
import {ApiService} from '../../services/api.service';

@Injectable()
export class AdminPanelService {
    public token: string;
    constructor(
        private $http: Http,
        private apiService: ApiService
    ) {}
    // UOM
    getListUOM(params) {
        const url = 'uom';
        return this.apiService.get(url, params);
    }
    postUOM(params) {
        const url = 'uom';
        return this.apiService.post(url, params);
    }
    updateUOM(id, params) {
        const url = 'uom/' + id;
        return this.apiService.put(url, params);
    }

    // Shipment Method
    getListShipmentMethod(params) {
        const url = 'shipment_method';
        return this.apiService.get(url, params);
    }
    postShipmentMethod(params) {
        const url = 'shipment_method';
        return this.apiService.post(url, params);
    }
    updateShipmentMethod(id, params) {
        const url = 'shipment_method/' + id;
        return this.apiService.put(url, params);
    }
    // Shipment method Type
    getListShipmentMethodType() {
        const url = 'shipment_method_type/all';
        return this.apiService.get(url);
    }

}
