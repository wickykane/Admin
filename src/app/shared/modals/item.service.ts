import { Injectable } from '@angular/core';
import { ApiService } from '../../services/index';

@Injectable()
export class ItemService {

    constructor(private API: ApiService) { }


    getListItemBaseSupplier(params, id) {
        var url = 'item?supplier_id=' + id;
        return this.API.get(url, params);
    }

    getListBundleBase(params) {
        var url = ['bundle', 'reference'].join('/');
        return this.API.get(url);
    }

    getReferenceList() {
        var url = ['reference', 'item-data'].join('/');
        return this.API.get(url);
    }

    getListCountry() {
        var url = 'country/get-all';
        return this.API.get(url);
    }

    getStateByCountry( params) {
        var url = 'state/get-by-country'
        return this.API.get(url, params);
    }

}
