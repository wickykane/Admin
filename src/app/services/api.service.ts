import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { environment } from '../../environments/environment';
import { JwtService } from '../shared';
import { catchError, retry } from 'rxjs/operators';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

@Injectable()
export class ApiService {
    public token: string;

    constructor(public http: Http, public httpClient: HttpClient, private jwtService: JwtService) {
        // set token if saved in local storage
        // var currentUser = JSON.parse(localStorage.getItem('currentUser'));
        // this.token = currentUser && currentUser.token;
    }

    private headerFormData() {
        const _token = window.localStorage.getItem('token');
        const _headers = new Headers({ 'Authorization': 'Bearer ' + this.jwtService.getToken() });
        const _options = new RequestOptions({ headers: _headers });
        return _options;
    }

    private headerJson(params?) {
        const _token = window.localStorage.getItem('token');
        const _headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.jwtService.getToken() });
        const _options = new RequestOptions({ headers: _headers, params: params });
        return _options;
    }

    private headerOptionDefault(params?) {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.jwtService.getToken() }),
        };
        if (params) {
            httpOptions['params'] = params;
        }
        return httpOptions;
    }

    private headerOptionFormData() {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + this.jwtService.getToken() })
        };
        return httpOptions;
    }

    private handleError(error: Response | any) {
        // In a real world app, you might use a remote logging infrastructure
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        return Observable.throw(JSON.parse(errMsg));
    }



    get(path, params?): Observable<any> {
        return this.httpClient.get(`${environment.api_url}${path}`, this.headerOptionDefault(params))
            // .catch(this.handleError);
            .map((res: Response) => res);

    }

    post(path, params: Object = {}): Observable<any> {
        return this.httpClient.post(`${environment.api_url}${path}`, JSON.stringify(params), this.headerOptionDefault())
            // .catch(this.handleError);
            .map((res: Response) => res);

    }

    put(path, params: Object = {}): Observable<any> {
        return this.httpClient.put(`${environment.api_url}${path}`, JSON.stringify(params), this.headerOptionDefault())
            // .catch(this.handleError);
            .map((res: Response) => res);


    }

    delete(path): Observable<any> {
        return this.httpClient.delete(`${environment.api_url}${path}`, this.headerOptionDefault())
            // .catch(this.handleError);
            .map((res: Response) => res);

    }

    deleteWithParam(path: string, body: Object = {}): Observable<any> {
        return this.httpClient.delete(`${environment.api_url}${path}`, this.headerOptionDefault(body))
            // .catch(this.handleError);
            .map((res: Response) => res);

    }

    postForm(path, formData) {
        return this.http.post(`${environment.api_url}${path}`, this.madeFormData(formData), this.headerFormData())
            // .catch(this.handleError);
            .map((res: Response) => res);

    }

    putForm(path, formData) {
        return this.http.put(`${environment.api_url}${path}`, this.madeFormData(formData), this.headerFormData())
            // .catch(this.handleError);
            .map((res: Response) => res);

    }

    madeFormData(data) {
        const formData: FormData = new FormData();
        for (const i in data) {
            formData.append(i, data[i]);
        }
        return formData;
    }
}
