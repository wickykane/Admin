import { Injectable } from '@angular/core';
import { ApiService } from '../../services/index';

@Injectable()
export class CustomerService {

    constructor(private API: ApiService) { }

    getListCountry() {
        const url = 'country/get-all';
        return this.API.get(url);
    }

    getListBuyerType() {
        const url = 'company_type/all';
        return this.API.get(url);
    }
    /**
     * Buyer
     */
    // supplier
    getListState() {
        const url = 'state/get-all';
        return this.API.get(url);
    }
    getSalePriceList() {
        const url = 'sale-price/get-list-option';
        return this.API.get(url);
    }
    getListBuyer(params) {
        const url = 'buyer/index';
        return this.API.get(url, params);
    }
    createBuyer(data) {
        const url = 'buyer/create';
        return this.API.postForm(url, data);
    }
    updateBuyer(data, id) {
        const url = 'buyer/update/' + id;
        return this.API.postForm(url, data);
    }
    deleteBuyer(id) {
        const url = 'buyer/delete/' + id;
        return this.API.delete(url);
    }
    getDetailBuyer(id) {
        const url = 'buyer/detail/' + id;
        return this.API.get(url);
    }
    getStateByCountry(params) {
        const url = 'state/get-by-country';
        return this.API.get(url, params);
    }
    deleteAddress(params) {
        const url = 'buyer/delete-address';
        return this.API.deleteWithParam(url, params);
    }

    getListAddress(params) {
        const url = 'buyer/index';
        return this.API.get(url, params);
    }

    getListContact(params) {
        const url = 'buyer/index';
        return this.API.get(url, params);
    }

    getListSite(params) {
        const url = 'buyer/index';
        return this.API.get(url, params);
    }

    getListQuote(params) {
        const url = 'buyer/index';
        return this.API.get(url, params);
    }

    getListSO(id, params) {
        const url = 'buyer/sales-orders/' + id;
        return this.API.get(url, params);
    }

    getListInvoice(params) {
        const url = 'buyer/index';
        return this.API.get(url, params);
    }

    getListShipment(params) {
        const url = 'buyer/index';
        return this.API.get(url, params);
    }

    getListPayment(params) {
        const url = 'buyer/index';
        return this.API.get(url, params);
    }

    getListRMA(params) {
        const url = 'buyer/index';
        return this.API.get(url, params);
    }

    getListAccount(params) {
        const url = 'buyer/index';
        return this.API.get(url, params);
    }

    getListCard(params) {
        const url = 'buyer/index';
        return this.API.get(url, params);
    }

    getDetailCustomer(id) {
        const url = 'buyer/' + id;
        return this.API.get(url);
    }

    /**
     * CUSTOMER
     */
    //

    createCustomer(data) {
        const url = 'buyer/create';
        return this.API.post(url, data);
    }
    getListCountryAdmin() {
        const url = 'country/admin/get-all';
        return this.API.get(url);
    }
    generateSiteCode() {
        const url = 'buyer/generate-code';
        return this.API.get(url);
    }

    getListCustomerType() {
        const url = 'buyer/type';
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
}
