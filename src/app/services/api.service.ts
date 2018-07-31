import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, Response, URLSearchParams } from '@angular/http';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { catchError, retry } from 'rxjs/operators';
// tslint:disable-next-line:import-blacklist
import { Observable } from 'rxjs/Rx';
import { environment } from '../../environments/environment';
import { JwtService } from '../shared';

@Injectable()
export class ApiService {
    public token: string;

    constructor(public http: Http, public httpClient: HttpClient, private jwtService: JwtService) {
        //  set token if saved in local storage
        //  var currentUser = JSON.parse(localStorage.getItem('currentUser'));
        //  this.token = currentUser && currentUser.token;
    }

    private headerFormData() {
        //  const _token = window.localStorage.getItem('token');
        //  const _headers = new Headers({ 'Authorization': 'Bearer ' + this.jwtService.getToken() });
        //  const _options = new RequestOptions({ headers: _headers });
        //  return _options;

        const httpOptions = {
            headers: new HttpHeaders({ 'Authorization': 'Bearer ' + this.jwtService.getToken() }),
        };
        //  if (params) { httpOptions['params'] = params; }
        return httpOptions;
    }

    private headerJson(params?) {
        const _token = window.localStorage.getItem('token');
        const _headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.jwtService.getToken() });
        const _options = new RequestOptions({ headers: _headers, params });
        return _options;
    }

    private headerOptionDefault(params?) {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.jwtService.getToken() }),
        };
        if (params) { httpOptions['params'] = params; }
        return httpOptions;
    }

    private headerOptionFormData() {
        const httpOptions = {
            headers: new HttpHeaders(
                { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + this.jwtService.getToken() }
            )};
        return httpOptions;
    }

    private _serverError(err) {
        if (err.error instanceof ErrorEvent) {
            return new ErrorObservable(JSON.parse(err._body));
        }
        return new ErrorObservable(err.error);
    }
    private _customServerError(err) {
        if (err.error instanceof ErrorEvent) {
            return new ErrorObservable(JSON.parse(err._body));
        }
        else{
            if(err.error.data.return_reason){
                return new ErrorObservable(err.error)
            }
        }
        return new ErrorObservable(err.error);
    }


    get(path, params?): Observable<any> {
        return this.httpClient.get(`${environment.api_url}${path}`, this.headerOptionDefault(params))
            .pipe(
                catchError(this._serverError)
            );
        //  .map(res => res.json())  //  could raise an error if invalid JSON
        //  .do(data => data)  //  debug
        //  .catch(this._serverError);
    }

    post(path, params: object = {}): Observable<any> {
        return this.httpClient.post(`${environment.api_url}${path}`, JSON.stringify(params), this.headerOptionDefault())
            //  .map(res => res.json())  //  could raise an error if invalid JSON
            //  .do(data => data)  //  debug
            .pipe(
                catchError(this._serverError)
            );
    }
    customPost(path, params: object = {}): Observable<any> {
        return this.httpClient.post(`${environment.api_url}${path}`, JSON.stringify(params), this.headerOptionDefault())
            //  .map(res => res.json())  //  could raise an error if invalid JSON
            //  .do(data => data)  //  debug
            .pipe(
                catchError(this._customServerError)
            );
    }
    put(path, params: object = {}): Observable<any> {
        return this.httpClient.put(`${environment.api_url}${path}`, JSON.stringify(params), this.headerOptionDefault())
            //  .map(res => res.json())  //  could raise an error if invalid JSON
            //  .do(data => data)  //  debug
            .pipe(
                catchError(this._serverError)
            );

    }

    delete(path): Observable<any> {
        return this.httpClient.delete(`${environment.api_url}${path}`, this.headerOptionDefault())
            //  .map(res => res.json())  //  could raise an error if invalid JSON
            //  .do(data => data)  //  debug
            //  .catch(this._serverError);
            .pipe(
                catchError(this._serverError)
            );
    }

    deleteWithParam(path: string, body: object = {}): Observable<any> {
        return this.httpClient.delete(`${environment.api_url}${path}`, this.headerOptionDefault(body))
            //  .map(res => res.json())  //  could raise an error if invalid JSON
            //  .do(data => data)  //  debug
            //  .catch(this._serverError);
            .pipe(
                catchError(this._serverError)
            );
    }

    postForm(path, formData) {
        return this.httpClient.post(`${environment.api_url}${path}`, formData, this.headerFormData())
            //  .map(res => res.json())
            //  .catch(this._serverError);
            .pipe(
                catchError(this._serverError)
            );
    }

    putForm(path, formData) {
        return this.httpClient.put(`${environment.api_url}${path}`, formData, this.headerFormData())
            //  .map(res => res.json())
            //  .catch( this._serverError);
            .pipe(
                catchError(this._serverError)
            );
    }

    madeFormData(data) {
        const formData: FormData = new FormData();
        //  tslint:disable-next-line:forin
        for (const i in data) {
            formData.append(i, data[i]);
        }
        return formData;
    }
}
