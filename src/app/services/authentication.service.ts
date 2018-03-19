import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/Rx';



@Injectable()
export class AuthenticationService {
    public token: string;

    constructor(public http: Http) {

    }

    private _serverError(err: any) {
        if (err instanceof Response) {
            return Observable.throw(err.json().message || 'backend server error');
        }
        return Observable.throw(err || 'backend server error');
    }

    doLogin(url, body) {
        let _headers = new Headers({ 'Content-Type': 'application/json' });
        let _options = new RequestOptions({ headers: _headers });

        return this.http.post(url, body, _options)
            .map(res => res.json())  // could raise an error if invalid JSON
            .do(data => console.log('server data:', data))  // debug
            .catch(this._serverError);
    }


}
