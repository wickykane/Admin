import { Injectable } from '@angular/core';
import { ApiService } from '../../services/index';

@Injectable()
export class PurchaseService {

    constructor(private API: ApiService) { }

    /**
     * PURCHASE QUOTATION
     */
    // Quotation
    getListPurchaseQuotation(params) {
        let url = 'purchase_quote';
        return this.API.get(url, params);
    }
    createPurchaseQuotation(params) {
        let url = 'purchase_quote';
        return this.API.post(url, params);
    }
    getDetailPurchaseQuotation(id) {
        let url = 'purchase_quote/' + id;
        return this.API.get(url);
    }
    upddatePurchaseQuotation(params, id) {
        let url = 'purchase_quote/' + id;
        return this.API.put(url, params);
    }
    getListSupplier(params) {
        let url = 'company/list-option-company?is_supplier=true';
        return this.API.get(url, params);
    }
    getListStatus() {
        let url = 'purchase_quote_status';
        return this.API.get(url);
    }
    sentToSuppPQ(id) {
        let url = 'purchase_quote/sent_to_supp/' + id;
        return this.API.put(url);
    }
    aprvByMgrPQ(id) {
        let url = 'purchase_quote/aprv_by_mgr/' + id;
        return this.API.put(url);
    }
    rjtByMgrPQ(id) {
        let url = 'purchase_quote/rjt_by_mgr/' + id;
        return this.API.put(url);
    }
    generateCodePurchaseQuotation() {
        let url = 'purchase_quote/generate_code';
        return this.API.get(url);
    }
    /**
     * PURCHASE Order
     */
    // Order
    getListPurchaseOrder(params) {
        let url = 'rma/get-list';
        return this.API.get(url, params);
    }
    createPurchaseOrder(params) {
        let url = 'oli_purchase_order';
        return this.API.post(url, params);
    }
    getDetailPurchaseOrder(id) {
        let url = 'oli_purchase_order/' + id;
        return this.API.get(url);
    }
    getListStatusOrder() {
        let url = 'oli_purchase_order/status';
        return this.API.get(url);
    }
    getPOCode() {
        let url = 'oli_purchase_order/generate_code';
        return this.API.get(url);
    }
    getListQuoteApproved(params) {
        let url = 'purchase_quote';
        return this.API.get(url, params);
    }
    getListIncoterm() {
        let url = 'incoterm';
        return this.API.get(url);
    }
    getListCompanySetup() {
        let url = ['company-master', 'index'].join('/');
        return this.API.get(url);
    }
    getListWarehouse() {
        let url = 'warehouse/index';
        return this.API.get(url);
    }
    sendMailPO(params, id) {
        let url = 'sale-price';
        return this.API.post(url, params);
    }
    /**
     * INBOUND DELIVERY
     */
    // Inbound
    getListInboundDelievery(params) {
        let url = 'purchase_order_delivery';
        return this.API.get(url, params);
    }
    /**
     * WAREHOUSE RECEIPT
     */
    // Warehouse
    getListWarehouseReceipt(params) {
        let url = 'warehouse_receipt';
        return this.API.get(url, params);
    }
    createWarehouseReceipt(params) {
        let url = 'warehouse_receipt';
        return this.API.post(url, params);
    }
    updateStatusWarehouseReceiptCode(params, id) {
        let url = 'warehouse_receipt/status/' + id;
        return this.API.put(url, params);
    }
    getPurchaseOrderDelivery() {
        let url = 'purchase_order_delivery?is_all=1&sts=2';
        return this.API.get(url);
    }
    generationWarehouseReceiptCode() {
        let url = 'warehouse_receipt/generate_code';
        return this.API.get(url);
    }
    getDetailDeliveryOrder(id) {
        let url = 'purchase_order_delivery/' + id;
        return this.API.get(url);
    }
    /**
     * SUPPLIER
     */
    // supplier
    getListCountry() {
        let url = 'country/get-all';
        return this.API.get(url);
    }
    getListState() {
        let url = 'state/get-all';
        return this.API.get(url);
    }
    createBuyer(data) {
        let url = 'buyer/create';
        return this.API.postForm(url, data);
    }
    updateBuyer(data, id) {
        let url = 'buyer/update/' + id;
        return this.API.postForm(url, data);
    }
    getDetailBuyer(id) {
        let url = 'buyer/detail/' + id;
        return this.API.get(url);
    }
    getStateByCountry( params) {
        let url = 'state/get-by-country'
        return this.API.get(url, params);
    }
    deleteAddress(params) {
        let url = 'buyer/delete-address';
        return this.API.deleteWithParam(url, params);
    }



}
