import { Injectable } from '@angular/core';
import { ApiService } from '../../services/index';

@Injectable()
export class ItemService {

    constructor(private API: ApiService) { }


    getListItemBaseSupplier(params, id) {
        let url = 'item?supplier_id=' + id;
        return this.API.get(url, params);
    }

    getListBundleBase(params) {
        let url = ['bundle', 'reference'].join('/');
        return this.API.get(url);
    }

    getReferenceList() {
        let url = ['item', 'reference'].join('/');
        return this.API.get(url);
    }
    
    getListAllItem(params){
        let url =['item'].join('/');
        return this.API.get(url,params);
    }

    getListCountry() {
        let url = 'country/get-all';
        return this.API.get(url);
    }

    getStateByCountry( params) {
        let url = 'state/get-by-country'
        return this.API.get(url, params);
    }

}
