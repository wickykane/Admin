import { Injectable } from '@angular/core';
import { ApiService } from '../../services/index';

@Injectable()
export class PurchaseService {

    constructor(private API: ApiService) { }

    /**
     * PURCHASE QUOTATION
     */
    //Quotation
    getListPurchaseQuotation(params) {
        var url = 'purchase_quote';
        return this.API.get(url, params);

    }

    getListSupplier(params) {
        var url = 'company/list-option-company?is_supplier=true';
        return this.API.get(url, params);
    }

    getListStatus() {
        var url = 'purchase_quote_status';
        return this.API.get(url);

    }


}
