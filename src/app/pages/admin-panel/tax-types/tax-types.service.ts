import { Injectable } from '@angular/core';
import { ApiService } from '../../../services/api.service';

@Injectable()
export class TaxTypesService {
    constructor(private API: ApiService) { }

    getListTaxTypes(params) {
        const url = 'tax/get-search-list';
        return this.API.get(url, params);
    }

     getListActiveTaxTypes() {
         const url = 'tax/get-active-list';
         return this.API.get(url);
     }
     getDetailTaxTypeById(id) {
         const url = 'tax/get-detail/' + id;
         return this.API.get(url);
     }

     postTaxTypes(params) {
        const url = 'tax/create' ;
        return this.API.post(url, params);
    }

     updateTaxTypesByID(id, params) {
        const url = 'tax/update/' + id;
        return this.API.put(url, params);
    }

    changeStatus(id, params) {
        const url = 'tax/update-status/' + id;
        return this.API.put(url, params);
    }

    deleteTaxTypesById(id) {
        const url = 'tax/delete/' + id;
        return this.API.delete(url);
    }

}
