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

    getListCountry() {
        const url = 'country/get-all';
        return this.API.get(url);
    }

    getStateByCountry(params) {
        const url = 'state/get-by-country'
        return this.API.get(url, params);
    }

}
