import { Injectable } from '@angular/core';
import { ApiService } from '../../services/index';

@Injectable()
export class DashboardService {

    constructor(private API: ApiService) { }

    /**
     * PROMOTION
     */
    //
    getOverAllCount(params) {
        var url = ['reports', 'count-overall'].join('/');
        return this.API.get(url, params);
    }
    topProductSoldByCategory(){
        var url =['reports','top-product-sold-by-category'].join('/');
        return this.API.get(url);
    }



}
