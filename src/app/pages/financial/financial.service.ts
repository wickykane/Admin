import { Injectable } from '@angular/core';
import { ApiService } from '../../services/index';

@Injectable()
export class FinancialService {

    constructor(private API: ApiService) { }

    /**
     * PROMOTION
     */
    //
    getOverAllCount(params) {
        const url = ['reports', 'count-overall'].join('/');
        return this.API.get(url, params);
    }




}
