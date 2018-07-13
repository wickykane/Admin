import { Injectable } from '@angular/core';
import { ApiService } from '../../services/index';

@Injectable()
export class ItemService {

    constructor(private API: ApiService) { }


    getListItemBaseSupplier(params, id) {
        const url = 'item?supplier_id=' + id;
        return this.API.get(url, params);
    }

    getListBundleBase(params) {
        const url = ['bundle', 'reference'].join('/');
        return this.API.get(url);
    }

    getReferenceList() {
        const url = ['item', 'reference'].join('/');
        return this.API.get(url);
    }

    getListAllItem(params) {
        const url = ['item'].join('/');
        return this.API.get(url, params);
    }
    getMasterItems(params) {
        const url = 'order/getMasterItems';
        return this.API.get(url, params);
    }
    getListAllItemFromQuote(id, params) {
        const url = ['order', 'getQuoteItems', id].join('/');
        return this.API.get(url, params);
    }

    getListCountry() {
        const url = 'country/get-all';
        return this.API.get(url);
    }

    getStateByCountry(params) {
        const url = 'state/get-by-country';
        return this.API.get(url, params);
    }

    /**
     * Customer
     */
    //  customer
    getListCountryAdmin() {
        const url = 'country/admin/get-all';
        return this.API.get(url);
    }

    getListBank() {
        const url = 'bank/list';
        return this.API.get(url);
    }

    getListBranchByBank(bank_id) {
        const url = 'bank/' + bank_id + '/branch/list';
        return this.API.get(url);
    }

    //  Order
    getListSalesQuoteReference(company_id) {
        const url = 'sale-quote/reference/' + company_id;
        return this.API.get(url);
    }
    getListSalesQuoteItem(company_id, params) {
        const url = 'sale-quote/item/list/' + company_id;
        return this.API.get(url, params);
    }

    getListItemReference(company_id) {
        const url = 'sale-quote/item/reference/' + company_id;
        return this.API.get(url);
    }
    getListSaleOrderByCompany(company_id) {
        const url = 'buyer/sales-orders/' + company_id;
        return this.API.get(url);
    }

}
