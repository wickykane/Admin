import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable()
export class CommonService {
    constructor(private apiService: ApiService) { }
    getListCountry() {
        const url = 'country/admin/get-all';
        return this.apiService.get(url);
    }

    getStateByCountry(params) {
        const url = 'state/get-by-country';
        return this.apiService.get(url, params);
    }
}
