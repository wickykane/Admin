import { Injectable } from '@angular/core';
import { ApiService } from '../../services/index';

@Injectable()
export class CustomerService {

    constructor(private API: ApiService) { }

    getListCountry() {
        var url = 'country/get-all';
        return this.API.get(url);
    }

    getListBuyerType() {
        var url = 'company_type/all';
        return this.API.get(url);
    }
}