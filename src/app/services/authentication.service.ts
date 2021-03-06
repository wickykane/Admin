import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, Response } from '@angular/http';
// tslint:disable-next-line:import-blacklist
import { Observable } from 'rxjs/Rx';

import { environment } from '../../environments/environment';
import { JwtService } from '../shared';

@Injectable()
export class AuthenticationService {
    public token: string;

    constructor(public http: Http, private jwtService: JwtService) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.token = currentUser && currentUser.token;
    }

    private _serverError(err: any) {
        if (err instanceof Response) {
            return Observable.throw(err.json().message || 'backend server error');
        }
        return Observable.throw(err || 'backend server error');
    }

    login(params) {
        const url = environment.api_url + 'auth/login';
        return this.http.post(url, params).map(
            (response: Response) => {
                const results = response.json().results;
                const token = results.token;
                if (token) {
                    this.token = token;
                    //  console.log( this.jwtHelper.decodeToken( this.token ) );
                    //  console.log( this.jwtHelper.getTokenExpirationDate( this.token ) );
                    //  console.log( this.jwtHelper.isTokenExpired( this.token ) );
                    this.jwtService.saveToken(this.token);
                    localStorage.setItem('currentUser', JSON.stringify(results.info));

                    return true;
                } else {
                    //  return false to indicate failed login
                    return false;
                }

            }
        ).do(data => console.log('server data:', data))  //  debug
            .catch(this._serverError);
    }

    logout(): void {
        //  clear token remove user from local storage to log user out
        this.token = null;
        this.jwtService.destroyToken();
        this.jwtService.destroyUser();
    }


}
