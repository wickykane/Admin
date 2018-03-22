import { Injectable } from '@angular/core';
import { Http,RequestOptions, Response } from '@angular/http';
import { ApiService } from '../../../services';

@Injectable()
export class QuotationService {
    public token:string;
    constructor(
        private $http:Http,
        private ApiService: ApiService
    ){}

    getTaskData( param ) {
        var url = '/report/task';
        return this.ApiService.get( url, param );
    }




}
