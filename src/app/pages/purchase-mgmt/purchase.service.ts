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

    sentToSuppPQ(id) {
        var url = 'purchase_quote/sent_to_supp/' + id;
        return this.API.put(url);
    }

    aprvByMgrPQ(id) {
        var url = 'purchase_quote/aprv_by_mgr/' + id;
        return this.API.put(url);
    }

    rjtByMgrPQ(id) {
        var url = 'purchase_quote/rjt_by_mgr/' + id;
        return this.API.put(url);
    }

    generateCodePurchaseQuotation() {
        var url = 'purchase_quote/generate_code';
        return this.API.get(url);
    }

    createPurchaseQuotation(params) {
        var url = 'purchase_quote';
        return this.API.post(url, params);
    }


}
