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
        return this.API.post(url, data);
    }
    updateBuyer(data, id) {
        let url = 'buyer/update/' + id;
        return this.API.post(url, data);
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
}