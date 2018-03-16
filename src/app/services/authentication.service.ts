import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/Rx';
import { Constant } from '../../environments/constant';


@Injectable()
export class AuthenticationService {
    public token: string;

    constructor(public http: Http, public constant: Constant) {
        // set token if saved in local storage
        var currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.token = currentUser && currentUser.token;
    }

    private headerFormData() {
        let _token = window.localStorage.getItem('token');
        let _headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + _token });
        let _options = new RequestOptions({ headers: _headers });
        return _options;
    }

    private headerJson() {
        let _token = window.localStorage.getItem('token');
        let _headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + _token });
        let _options = new RequestOptions({ headers: _headers });
        return _options;
    }

    private _serverError(err: any) {
        if (err instanceof Response) {
            return Observable.throw(err.json().message || 'backend server error');
        }
        return Observable.throw(err || 'backend server error');
    }

    doLogin(body) {
        let _headers = new Headers({ 'Content-Type': 'application/json' });
        let _options = new RequestOptions({ headers: _headers });
        let _url = this.constant.BASE_URL + 'auth/login';
        return this.http.post(_url, body, _options)
            .map(res => res.json())  // could raise an error if invalid JSON
            .do(data => console.log('server data:', data))  // debug
            .catch(this._serverError);
    }


}
