import { Injectable } from '@angular/core';
import { ApiService } from '../../services/index';

@Injectable()
export class OrderService {

    constructor(private ApiService: ApiService) { }
    //Buyer RFQ
    //Order
  
    getBuyerType() {
        let url = 'company_type/all';
        return this.ApiService.get(url);
    }
    
    getActiveProgram(id) {
        let url = 'buyer/active-programs/' + id;
        return this.ApiService.get(url);
    }

    getListCompany(type) {
        let url = 'company/list-option-company?buyer_type=' + type;
        return this.ApiService.get(url);
    }

    getDetailCompany(id) {
        let url = 'company/information-of-company/' + id;
        return this.ApiService.get(url);
    }

    getListOrder(params) {
        let url = 'order/list-order';
        return this.ApiService.get(url, params);
    }

    getListStatus() {
        let url = 'order/list-status';
        return this.ApiService.get(url);
    }

    countOrderStatus() {
        let url = 'reports/order-status-count';
    }
    
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

    getListItemById(params) {
        var url = 'product/list-product-to-order';
        return this.ApiService.get(url, params);
    }

    createOrder(params) {
        var url = 'order/create-order';
        return this.ApiService.post(url, params);
    }

    getOrderNumber(id) {
        var url = ['order', 'generate-order-number', id].join('/');
        return this.ApiService.get(url);
    }

    getStatisticalOrder(params) {
        var url = 'order/statistical-order';
        return this.ApiService.get(url, params);
    }

    approveOrd(ordId) {
        var url = 'order/approved/' + ordId;
        return this.ApiService.put(url);
    }

    cancelOrd(ordId) {
        var url = 'order/cancel/' + ordId;
        return this.ApiService.put(url);
    }
    sendEmail(params) {
        var url = 'order/sent-message';
        return this.ApiService.put(url, params);
    }
    generateSO() {
        var url = 'order/get-order-code';
        return this.ApiService.get(url);
    }
    getHistoryByCode(code) {
        var url = "order/history?order_cd=" + code;
        return this.ApiService.get(url);
    }
    getInvoice(id) {
        var url = "order/invoice/" + id;
        return this.ApiService.get(url);
    }
    previewOrder(params) {
        var url = 'order/preview-order';
        return this.ApiService.post(url, params);
    }
    cloneOrder(order_id) {
        var url = 'order/clone-order/' + order_id;
        return this.ApiService.post(url);
    }
}