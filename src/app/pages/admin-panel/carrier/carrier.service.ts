import { Injectable } from '@angular/core';
import { ApiService } from '../../../services/index';

@Injectable()
export class CarrierService {

    constructor(private API: ApiService) { }

    getListCarrier(params) {
        const url = 'carrier';
        return this.API.get(url, params);
    }

    getCarrierById(id) {
        const url = 'carrier/' + id;
        return this.API.get(url);
    }

    putCarrierById(id, params) {
        const url = 'carrier/' + id;
        return this.API.put(url, params);
    }

    getListBank() {
        const url = 'bank/list';
        return this.API.get(url);
    }

    getBranchByBank(id) {
        const url = `bank/${id}/branch/list`;
        return this.API.get(url);
    }

    createCarrier(params) {
        const url = 'carrier';
        return this.API.post(url, params);
    }
}
