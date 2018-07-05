import { Injectable } from '@angular/core';
import { ApiService } from '../../../services/index';

@Injectable()
export class CarrierService {

    constructor(private API: ApiService) { }

    getListCarrier() {
        const url = 'country/get-all';
        return this.API.get(url);
    }
}
