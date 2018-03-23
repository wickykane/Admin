import { Injectable } from '@angular/core';
import { ApiService } from '../../services/index';

@Injectable()
export class OrderService {

    constructor(private ApiService: ApiService) { }
    //Buyer RFQ
    getListBuyerRFQ(params){
        let url ='rfq';
        return this.ApiService.get(url,params);
    }

}