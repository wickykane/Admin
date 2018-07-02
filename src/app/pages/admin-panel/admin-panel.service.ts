import { Injectable } from '@angular/core';
import { Http,RequestOptions, Response } from '@angular/http';
import {ApiService} from '../../services/api.service';

@Injectable()
export class AdminPanelService {
    public token:string;
    constructor(
        private $http:Http,
        private ApiService: ApiService
    ){}
    // UOM
    getListUOM(params){
        let url ='uom';
        return this.ApiService.get(url,params);
    }
    postUOM(params){
        let url ='uom';
        return this.ApiService.post(url,params);
    }
    updateUOM(id,params){
        let url='uom/'+id;
        return this.ApiService.put(url,params);
    }

    // Shipment Method
    getListShipmentMethod(params){
        let url ='shipment_method';
        return this.ApiService.get(url,params);
    }
    postShipmentMethod(params){
        let url ='shipment_method';
        return this.ApiService.post(url,params);
    }
    updateShipmentMethod(id,params){
        let url ='shipment_method/'+id;
        return this.ApiService.put(url,params);
    }
    // Shipment method Type
    getListShipmentMethodType(){
        let url ='shipment_method_type/all';
        return this.ApiService.get(url);
    }

}
