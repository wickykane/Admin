import { Injectable } from '@angular/core';
import { ApiService } from '../../services/index';

@Injectable()
export class OrderService {

    constructor(private API: ApiService) { }

    /**
     * Buyer RFQ
     */
    //
    getListBuyerRFQ(params){
        let url ='rfq';
        return this.API.get(url,params);
    }
     getList(params) {
        let url='sale-price/get-list';
         return this.API.get(url,params);
     }
      createSalePrice(params) {
         let url ='sale-price';
         return this.API.post(url, params);
     }
     getDetailSalePrice(id) {
         let url ='sale-price/'+id;
         return this.API.get(url);
     }
     updateSalePrice(id,params){
         let url ='sale-price/'+id;
         return this.API.put(url, params);
     }

     /**
      * Buyer RFQ
      */
     //
     getListDeliveryOrder(params){
         let url ='delivery-order/index';
         return this.API.get(url,params);
     }
     updateStatus(id){
         let url ='delivery-order/update/'+id;
         return this.API.post(url);
     }
     getDetailDeliveryOrder(id) {
         let url ='delivery-order/detail/' + id;
          return this.API.get(url);
     }
     getDeliveryCode(){
         let url ='delivery-order/get-delivery-order-code';
          return this.API.get(url);
     }
     getOrderDelievery() {
         let url ='order/list-order-delivery';
          return this.API.get(url);
     }
     getPickupLocation() {
         let url='warehouse/get-all';
          return this.API.get(url);
     }
     getProductByOrderAndAddr(params){
         let url ='order/list-item-order';
          return this.API.get(url,params);
     }
     createDeliveryOrder(params){
         let url ='delivery-order/create';
         return this.API.post(url, params);
     }


}
