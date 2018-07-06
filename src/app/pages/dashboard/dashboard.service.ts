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
        const url = ['reports', 'count-overall'].join('/');
        return this.API.get(url, params);
    }
    topProductSoldByCategory() {
        const url = ['reports', 'top-product-sold-by-category'].join('/');
        return this.API.get(url);
    }
    /**
     * REPORTS
     */
    //
    getRefenceCategory() {
        const url = ['item', 'reference', 'category'].join('/');
        return this.API.get(url);
    }
    getListPart(params) {
        const url = ['reports', 'top-selling-parts'].join('/');
        return this.API.get(url, params);
    }

    getListRepair(params) {
        const url = ['reports', 'top-selling-repair-shop'].join('/');
        return this.API.get(url, params);
    }

    getListRMA(params) {
        const url = ['reports', 'rma-status-report'].join('/');
        return this.API.get(url, params);
    }

    getListSaleOrder(params) {
        const url = ['reports', 'sale-order-status-report'].join('/');
        return this.API.get(url, params);
    }

    getCategorySold(params) {
        const url = ['reports', 'top-category-sold-report'].join('/');
        return this.API.get(url, params);
    }



}
