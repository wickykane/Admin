import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { environment } from '../../environments/environment';
import { JwtService } from '../shared';
import { catchError, retry } from 'rxjs/operators';

@Injectable()
export class ApiService {
    public token: string;

    constructor(public http: Http, public httpClient: HttpClient,  private jwtService:JwtService) {
        // set token if saved in local storage
        // var currentUser = JSON.parse(localStorage.getItem('currentUser'));
        // this.token = currentUser && currentUser.token;
    }

    private headerFormData(params?) {
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

    private headerOptionDefault () {
        let _token = window.localStorage.getItem('token');
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.jwtService.getToken() })
        }
        return httpOptions;
    }

    private headerOptionFormData () {
        let _token = window.localStorage.getItem('token');
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + this.jwtService.getToken() })
        }
        return httpOptions;
    }

    private _serverError(err: any) {
        if (err instanceof Response) {
            return Observable.throw(err.json().message || 'backend server error');
        }
        return Observable.throw(err || 'backend server error');
    }


    get(path, params:URLSearchParams = new URLSearchParams() ):Observable<any>  {
        console.log(path);
        return this.httpClient.get(`${environment.api_url}${path}`, this.headerOptionDefault())
        .pipe(
            catchError(this._serverError)
          );
            // .map(res => res.json())  // could raise an error if invalid JSON
            // .do(data => data)  // debug
            // .catch(this._serverError);
    };

    post(path, params:Object = {} ):Observable<any> {
        return this.httpClient.post(`${environment.api_url}${path}`, JSON.stringify(params), this.headerOptionDefault())
            // .map(res => res.json())  // could raise an error if invalid JSON
            // .do(data => data)  // debug
            .pipe(
                catchError(this._serverError)
              );
    };

    put(path, params:Object = {} ):Observable<any> {
        return this.httpClient.put(`${environment.api_url}${path}`, JSON.stringify(params), this.headerOptionDefault())
            // .map(res => res.json())  // could raise an error if invalid JSON
            // .do(data => data)  // debug
            .pipe(
                catchError(this._serverError)
              );
    };

    delete(path):Observable<any> {
        return this.httpClient.delete(`${environment.api_url}${path}`, this.headerOptionDefault())
            // .map(res => res.json())  // could raise an error if invalid JSON
            // .do(data => data)  // debug
            // .catch(this._serverError);
            .pipe(
                catchError(this._serverError)
              );
    };

    postForm(path, params:Object = {} ):Observable<any> {
        return this.http.post(`${environment.api_url}${path}`, this.madeFormData(params), this.headerFormData())
            .map(res => res.json())  // could raise an error if invalid JSON
            .do(data => console.log('server data:', data))  // debug
            .catch(this._serverError);
    };

    putForm(path, params:Object = {} ):Observable<any> {
        return this.http.put(`${environment.api_url}${path}`, this.madeFormData(params),this.headerFormData(params))
            .map(res => res.json())  // could raise an error if invalid JSON
            .do(data => console.log('server data:', data))  // debug
            .catch(this._serverError);
    };

    madeFormData(data) {
        let formData: FormData = new FormData();
        for (let i in data) {
            formData.append(i, data[i]);
        }
        return formData;
    }
}
