import { Injectable } from '@angular/core';
import { Http, RequestOptions, Response } from '@angular/http';
import { ApiService } from '../../../services/api.service';

@Injectable()
export class QuickbookService {
    constructor(private $http: Http, private apiService: ApiService) {}
}
