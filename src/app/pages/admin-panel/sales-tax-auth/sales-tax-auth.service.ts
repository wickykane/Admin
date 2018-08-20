import { Injectable } from '@angular/core';
import { Http, RequestOptions, Response } from '@angular/http';
import { ApiService } from '../../../services/api.service';

@Injectable()
export class SalesTaxAuthService {
    constructor(private $http: Http, private apiService: ApiService) {}

    getListSalesTax() {
        const url = 'tax/taxauthority/country/get-overview-tree';
        return this.apiService.get(url);
    }

    getListCountryDropDown() {
        const url = 'country/get-dropdown-list/';
        return this.apiService.get(url);
    }

    getTaxAuthorityTypes() {
        const url = 'tax/taxauthority/country/get-tax-type/';
        return this.apiService.get(url);
    }

    getCountryTaxAuthorityDetail(countryId) {
        const url = 'tax/taxauthority/country/get-detail/' + countryId;
        return this.apiService.get(url);
    }

    createCountryTaxAuthority(params) {
        const url = 'tax/taxauthority/country/create';
        return this.apiService.post(url, params);
    }

    updateCountryTaxAuthority(countryId, params) {
        const url = 'tax/taxauthority/country/update/' + countryId;
        return this.apiService.put(url, params);
    }
}
