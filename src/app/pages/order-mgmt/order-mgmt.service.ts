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
    //Sale Price List
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
     //Sale Quotation
     getListSalesQuotation(params){
         let url ="order/list-sale-quote";
         return this.ApiService.get(url,params);
     }
     getSalesQuotation(){
        let url ='order/get-sale-quote-code';
        return this.ApiService.get(url);
    }
    updateSaleQuoteStatus(sale_quote_id,params) {
        let url = 'order/update-sale-quote-status/' + sale_quote_id;
        return this.ApiService.put(url,params);
    }
    sentMailToBuyer(sale_quote_id){
        let url='order/sale-quote/sent-to-buyer/'+sale_quote_id;
        return this.ApiService.get(url);
    }
    getListSaleQuotationStatus(){
        let url='order/sale-quote/list-status';
        return this.ApiService.get(url);
    }

}