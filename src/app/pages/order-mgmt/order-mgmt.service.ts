import { Injectable } from '@angular/core';
import { ApiService } from '../../services/index';

@Injectable()
export class OrderService {


    constructor(private API: ApiService) { }

    //Order

    getBuyerType() {
        let url = 'company_type/all';
        return this.API.get(url);
    }

    getActiveProgram(id) {
        let url = 'buyer/active-programs/' + id;
        return this.API.get(url);
    }

    getListCompany(type) {
        let url = 'company/list-option-company?buyer_type=' + type;
        return this.API.get(url);
    }

    getDetailCompany(id) {
        let url = 'company/information-of-company/' + id;
        return this.API.get(url);
    }

    getListOrder(params) {
        let url = 'order/list-order';
        return this.API.get(url, params);
    }

    getListStatus() {
        let url = 'order/list-status';
        return this.API.get(url);
    }

    countOrderStatus() {
        let url = 'reports/order-status-count';
        return this.API.get(url);
    }


    getListBuyerRFQ(params){
        let url ='rfq';
        return this.API.get(url,params);
    }
    //Sale Price List
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
      * dELIVERY order
      */
     //
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

     //Sale Quotation
     getListSalesQuotation(params){
         let url ="order/list-sale-quote";
         return this.API.get(url,params);
     }
     getSalesQuotation(){
        let url ='order/get-sale-quote-code';
        return this.API.get(url);
    }
    updateSaleQuoteStatus(sale_quote_id,params) {
        let url = 'order/update-sale-quote-status/' + sale_quote_id;
        return this.API.put(url,params);
    }
    sentMailToBuyer(sale_quote_id){
        let url='order/sale-quote/sent-to-buyer/'+sale_quote_id;
        return this.API.get(url);
    }
    getListSaleQuotationStatus(){
        let url='order/sale-quote/list-status';
        return this.API.get(url);
    }

    getListItemById(params) {
        var url = 'product/list-product-to-order';
        return this.API.get(url, params);
    }

    createOrder(params) {
        var url = 'order/create-order';
        return this.API.post(url, params);
    }

    getOrderNumber(id) {
        var url = ['order', 'generate-order-number', id].join('/');
        return this.API.get(url);
    }

    getStatisticalOrder(params) {
        var url = 'order/statistical-order';
        return this.API.get(url, params);
    }

    approveOrd(ordId) {
        var url = 'order/approved/' + ordId;
        return this.API.put(url);
    }

    cancelOrd(ordId) {
        var url = 'order/cancel/' + ordId;
        return this.API.put(url);
    }
    sendEmail(params) {
        var url = 'order/sent-message';
        return this.API.put(url, params);
    }
    generateSO() {
        var url = 'order/get-order-code';
        return this.API.get(url);
    }
    getHistoryByCode(code) {
        var url = "order/history?order_cd=" + code;
        return this.API.get(url);
    }
    getInvoice(id) {
        var url = "order/invoice/" + id;
        return this.API.get(url);
    }
    previewOrder(params) {
        var url = 'order/preview-order';
        return this.API.post(url, params);
    }
    cloneOrder(order_id) {
        var url = 'order/clone-order/' + order_id;
        return this.API.post(url);
    }

}
