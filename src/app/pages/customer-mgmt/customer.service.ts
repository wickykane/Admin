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
    /**
     * Buyer
     */
    //supplier    
    getListState() {
        let url = 'state/get-all';
        return this.API.get(url);
    }
    getSalePriceList(){
        let url ='sale-price/get-list-option';
        return this.API.get(url);
    }
    getListBuyer(params) {
        let url = 'buyer/index';
        return this.API.get(url, params);
    }
    createBuyer(data) {
        let url = 'buyer/create';
        return this.API.postForm(url, data);
    }
    updateBuyer(data, id) {
        let url = 'buyer/update/' + id;
        return this.API.postForm(url, data);
    }
    deleteBuyer(id) {
        let url = 'buyer/delete/' + id;
        return this.API.delete(url);
    }
    getDetailBuyer(id) {
        let url = 'buyer/detail/' + id;
        return this.API.get(url);
    }
    getStateByCountry( params) {
        let url = 'state/get-by-country'
        return this.API.get(url, params);
    }
    deleteAddress(params) {
        let url = 'buyer/delete-address';
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
}
