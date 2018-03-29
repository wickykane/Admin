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
     getList(params) {
        let url='sale-price/get-list';
         return this.ApiService.get(url,params);
     }       
      createSalePrice(params) {
         let url ='sale-price';
         return this.ApiService.post(url, params);
     }
     getDetailSalePrice(id) {
         let url ='sale-price/'+id;
         return this.ApiService.get(url);
     }
     updateSalePrice(id,params){
         let url ='sale-price/'+id;
         return this.ApiService.put(url, params);
     }

}