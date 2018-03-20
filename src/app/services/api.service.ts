import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { environment } from '../../environments/environment';
import { JwtService } from '../shared';

@Injectable()
export class ApiService {
    public token: string;

    constructor(public http: Http, private jwtService:JwtService) {
        // set token if saved in local storage
        // var currentUser = JSON.parse(localStorage.getItem('currentUser'));
        // this.token = currentUser && currentUser.token;
    }

    private headerFormData(params) {
        let _token = window.localStorage.getItem('token');
        let _headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + this.jwtService.getToken() });
        let _options = new RequestOptions({ headers: _headers, params: params });
        return _options;
    }

    private headerJson(params?) {
        let _token = window.localStorage.getItem('token');
        let _headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.jwtService.getToken() });
        let _options = new RequestOptions({ headers: _headers, params: params });
        return _options;
    }

    private _serverError(err: any) {
        if (err instanceof Response) {
            return Observable.throw(err.json().message || 'backend server error');
        }
        return Observable.throw(err || 'backend server error');
    }


    get(path, params:URLSearchParams = new URLSearchParams() ):Observable<any>  {
        return this.http.get(`${environment.api_url}${path}`, this.headerJson(params))
            .map(res => res.json())  // could raise an error if invalid JSON
            .do(data => console.log('server data:', data))  // debug
            .catch(this._serverError);
    };

    post(path, params:Object = {} ):Observable<any> {
        return this.http.post(`${environment.api_url}${path}`, this.headerJson(params))
            .map(res => res.json())  // could raise an error if invalid JSON
            .do(data => console.log('server data:', data))  // debug
            .catch(this._serverError);
    };

    put(path, params:Object = {} ):Observable<any> {
        return this.http.put(`${environment.api_url}${path}`, this.headerJson(params))
            .map(res => res.json())  // could raise an error if invalid JSON
            .do(data => console.log('server data:', data))  // debug
            .catch(this._serverError);
    };

    delete(path):Observable<any> {
        return this.http.delete(`${environment.api_url}${path}`, this.headerJson(''))
            .map(res => res.json())  // could raise an error if invalid JSON
            .do(data => console.log('server data:', data))  // debug
            .catch(this._serverError);
    };

    postForm(path, params:Object = {} ):Observable<any> {
        return this.http.post(`${environment.api_url}${path}`, this.headerFormData(params))
            .map(res => res.json())  // could raise an error if invalid JSON
            .do(data => console.log('server data:', data))  // debug
            .catch(this._serverError);
    };

    putForm(path, params:Object = {} ):Observable<any> {
        return this.http.put(`${environment.api_url}${path}`, this.headerFormData(params))
            .map(res => res.json())  // could raise an error if invalid JSON
            .do(data => console.log('server data:', data))  // debug
            .catch(this._serverError);
    };
}
