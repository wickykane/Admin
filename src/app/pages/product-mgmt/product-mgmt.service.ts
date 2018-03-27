import { Injectable } from '@angular/core';
import { Http,RequestOptions, Response } from '@angular/http';
import {ApiService} from '../../services/api.service';

@Injectable()
export class ProductService {
    public token:string;
    constructor(
        private $http:Http,
        private ApiService: ApiService
    ){}
    //Item-Product Definition
    getListItem(params){
        let url ='item';
        return this.ApiService.get(url,params);
    }
    getListItemOption(){
        let url ='item/reference';
        return this.ApiService.get(url);
    }
    postProductDefinition(data,files){
        let url ='item';
        return this.ApiService.postForm(url,data);
    }
    updateProductDefinition(id,data,files){
        let url ='item'+id;
        return this.ApiService.putForm(url,data);
    }
    //Bundle
    getListBundle(params){
        let url ='bundle/get-list';
        return this.ApiService.get(url,params);
    }
    getBundleRef(params){
        let url ='bundle/reference';
        return this.ApiService.get(url,params);
    }
    postBundle(params){
        let url ='bundle';
        return this.ApiService.post(url,params);
    }
    getListBundleActive(){
        let url ='bundle/get-list-available';
        return this.ApiService.get(url);
    }
    getDetailBundle(id){
        let url ='bundle/'+id;
        return this.ApiService.get(url);
    }
    updateDetailBundle(id,params){
        let url ='bundle/'+id;
        return this.ApiService.put(url,params);
    }
    //Condition Product Group    
     getListCondition(params){
        let url ='promotion_condition';
        return this.ApiService.get(url,params);
    }
     getListConditionRef(params){
        let url ='promotion_condition/reference';
        return this.ApiService.get(url,params);
    }
     postCondition(params){
        let url ='promotion_condition';
        return this.ApiService.post(url,params);
    }
    //Ecatalog
    getListEcatalog(params){
        let url='catalog';
        return this.ApiService.get(url,params)
    }
    postECatalog(data,files){
        let url = 'catalog';
        return this.ApiService.postForm(url,data);
        
    }
    putECatalog(id,data,files){
        let url = 'catalog/'+id;
        return this.ApiService.putForm(url,data);        
    }
    getDetailCatalog(id){
        let url='catalog/'+id;
        return this.ApiService.get(url)
    }
}
