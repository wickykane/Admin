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
    getListUOM(params){
        let url ='uom';
        return this.ApiService.get(url,params);
    }
}
