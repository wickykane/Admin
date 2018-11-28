import { Injectable } from '@angular/core';
import { Headers, Http, ResponseContentType } from '@angular/http';
import { ApiService } from './api.service';

import { JwtService } from '../shared/guard/jwt.service';
@Injectable()
export class CommonService {
    constructor(
        private http: Http,
        private jwtService: JwtService,
        private apiService: ApiService) { }
    getListCountry() {
        const url = 'country/admin/get-all';
        return this.apiService.get(url);
    }

    getStateByCountry(params) {
        const url = 'state/get-by-country';
        return this.apiService.get(url, params);
    }

    getAllCustomer(params?) {
        const url = 'rma/get-all-customer';
        return this.apiService.get(url, params);
    }

    getDetailCustomer(id) {
        const url = 'rma/get-customer/' + id;
        return this.apiService.get(url);
    }

    getOrderByCustomer(id) {
        const url = 'rma/get-order-by-customer/' + id;
        return this.apiService.get(url);
    }

    getMasterData() {
        const url = 'rma/get-master-data';
        return this.apiService.get(url);
    }
    getCountryList() {
        const url = 'shipping-zone/list-country';
        return this.apiService.get(url);
    }

    getListCarrier(params = {}) {
        const url = 'carrier';
        return this.apiService.get(url, params);
    }

    getAllListBank() {
        const url = 'bank/list?is_all=1';
        return this.apiService.get(url);
    }
    getListBranchByBank(bank_id) {
        const url = 'bank/' + bank_id + '/branch/list?is_all=1';
        return this.apiService.get(url);
    }

    getOrderReference() {
        const url = 'order/reference-data';
        return this.apiService.get(url);
    }
    changeStatus(id) {
        const url = 'shipping-zone/change-status/' + id;
        return this.apiService.get(url);
    }
    exportDocument(file, fileName) {
        const _headers = new Headers({ 'Authorization': 'Bearer ' + this.jwtService.getToken() });
        return this.http
            .get(file, {
                responseType: ResponseContentType.Blob,
                headers: _headers
            })
            .map(res => {
                return {
                    filename: fileName,
                    data: res.blob()
                };
            })
            .subscribe(res => {
                if (window.navigator && window.navigator.msSaveOrOpenBlob) { // for IE
                    window.navigator.msSaveOrOpenBlob(res.data, res.filename);
                } else { // for Non-IE (chrome, firefox etc.)
                    const anchor = document.createElement('a');
                    const objectUrl = window.URL.createObjectURL(res.data);
                    anchor.href = objectUrl;
                    anchor.download = fileName;
                    anchor.click();
                    window.URL.revokeObjectURL(objectUrl);
                    anchor.remove(); // remove the element
                }
            }, error => {
                console.log('download error:', JSON.stringify(error));
            }, () => {
                console.log('Completed file download.');
            });
    }
}
