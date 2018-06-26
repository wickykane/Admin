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
    /**
     * REPORTS
     */
    // 
    getRefenceCategory() {
        var url = ['item','reference', 'category'].join('/');
        return this.API.get(url);
    }
    getListPart(params) {
        var url = ['reports','top-selling-parts'].join('/');
        return this.API.get(url, params);
    }

    getListRepair(params) {
        var url = ['reports','top-selling-repair-shop'].join('/');
        return this.API.get(url, params);
    }

    getListRMA(params) {
        var url = ['reports','rma-status-report'].join('/');
        return this.API.get(url, params);
    }

    getListSaleOrder(params) {
        var url = ['reports','sale-order-status-report'].join('/');
        return this.API.get(url, params);
    }
    
    getCategorySold(params) {
        var url = ['reports','top-category-sold-report'].join('/');
        return this.API.get(url, params);
    }



}
