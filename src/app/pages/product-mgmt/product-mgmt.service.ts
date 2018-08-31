import { Injectable } from '@angular/core';
import { Http, RequestOptions, Response } from '@angular/http';
import { ApiService } from '../../services/api.service';

@Injectable()
export class ProductService {
    public token: string;
    constructor(private $http: Http, private apiService: ApiService) {}

    updateItem(id, data) {
        const url = 'item/update/' + id;
        return this.apiService.postForm(url, data);
    }

    getDetailPart(id) {
        const url = 'item/' + id;
        return this.apiService.get(url);
    }

    // Item-Product Definition
    getListItem(params) {
        const url = 'item';
        return this.apiService.get(url, params);
    }
    getListItemOption() {
        const url = 'item/reference';
        return this.apiService.get(url);
    }
    postProductDefinition(data) {
        const url = 'item';
        return this.apiService.postForm(url, data);
    }
    updateProductDefinition(id, data, files) {
        const url = 'item' + id;
        return this.apiService.putForm(url, data);
    }
    // Bundle
    getListBundle(params) {
        const url = 'bundle/get-list';
        return this.apiService.get(url, params);
    }
    getBundleRef(params) {
        const url = 'bundle/reference';
        return this.apiService.get(url, params);
    }
    postBundle(params) {
        const url = 'bundle';
        return this.apiService.post(url, params);
    }
    getListBundleActive() {
        const url = 'bundle/get-list-available';
        return this.apiService.get(url);
    }
    getDetailBundle(id) {
        const url = 'bundle/' + id;
        return this.apiService.get(url);
    }
    updateDetailBundle(id, params) {
        const url = 'bundle/' + id;
        return this.apiService.put(url, params);
    }
    // Condition Product Group
    getListCondition(params) {
        const url = 'promotion_condition';
        return this.apiService.get(url, params);
    }
    getListConditionRef(params) {
        const url = 'promotion_condition/reference';
        return this.apiService.get(url, params);
    }
    postCondition(params) {
        const url = 'promotion_condition';
        return this.apiService.post(url, params);
    }
    // Ecatalog
    getListEcatalog(params) {
        const url = 'catalog';
        return this.apiService.get(url, params);
    }
    postECatalog(data) {
        const url = 'catalog';
        return this.apiService.postForm(url, data);
    }
    putECatalog(id, data, files) {
        const url = 'catalog/' + id;
        return this.apiService.putForm(url, data);
    }
    getDetailCatalog(id) {
        const url = 'catalog/' + id;
        return this.apiService.get(url);
    }
    // Master Data
    getReferList() {
        const url = ['item', 'reference'].join('/');
        return this.apiService.get(url);
    }
    getProductType() {
        const url = 'category';
        return this.apiService.get(url);
    }
    getProductCategory(id) {
        const url = 'category?parent_id=' + id;
        return this.apiService.get(url);
    }
    getGrapeVariety() {
        const url = 'grape_variety';
        return this.apiService.get(url);
    }
    getListBand() {
        const url = 'brand/reference';
        return this.apiService.get(url);
    }
    getListSupplier() {
        const url = 'company/list-option-company?is_supplier=1';
        return this.apiService.get(url);
    }
    getCountry() {
        const url = 'country/get-all';
        return this.apiService.get(url);
    }
    getStateByCountry(params) {
        const url = 'state/get-by-country';
        return this.apiService.get(url, params);
    }
    getListWarehouse() {
        const url = 'warehouse/reference';
        return this.apiService.get(url);
    }

    getAccountType() {
      const url = 'item/get-account-type';
      return this.apiService.get(url);
    }
    // mass price
    getListMassPrice(params) {
        const url = 'item/mass';
        return this.apiService.get(url, params);
    }
    postFileMassPrice(data) {
        const url = 'item/mass';
        return this.apiService.postForm(url, data);
    }
    getDetailMassPrice(id) {
        const url = 'item/mass/' + id;
        return this.apiService.get(url);
    }
    getPartList(params) {
        const url = 'item/part-list';
        return this.apiService.get(url, params);
    }
    getMiscTypeList() {
        const url = 'misc/types';
        return this.apiService.get(url);
    }
    getMiscList(params) {
        const url = 'misc';
        return this.apiService.get(url,params);
    }
    createNewMiscItems(params) {
        const url = 'misc';
        return this.apiService.post(url,params);
    }
    updateMiscItems(id,params) {
        const url = 'misc/'+id;
        return this.apiService.put(url,params);
    }
    generateMiscNumber(){
        const url = 'misc/generate-number';
        return this.apiService.get(url);
    }
    getAccountList(){
         const url = ['account', 'getAccountTree'].join('/');
        return this.apiService.get(url);
    }
    deleteMisc(id){
        const url = 'misc/'+id;
        return this.apiService.delete(url);
    }
    activeStatus(id){
        const url = 'misc/'+id+'/active';
        return this.apiService.put(url);
    }
    inActiveStatus(id){
        const url = 'misc/'+id+'/in-active';
        return this.apiService.put(url);
    }

}
