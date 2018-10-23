import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { environment } from '../../../environments/environment';
import { StorageService } from '../../services/storage.service';
import { ApiService } from './../../services/api.service';
import { JwtService } from './jwt.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private router: Router, private jwtService: JwtService) { }

    canActivate() {
        if (localStorage.getItem(this.jwtService.jwtTokenKey)) {
            return true;
        }
        window.location.href = '/#/login';
        return false;
    }
}

// tslint:disable-next-line:max-classes-per-file
@Injectable()
export class MasterFixGuard implements CanActivate {
    constructor(private router: Router, private storage: StorageService) { }
    canActivate(route: ActivatedRouteSnapshot) {
        const roles = route.data.role || [];
        const user = this.storage.getValue('user') || {};
        if (roles.indexOf(user.user_type) !== -1) {
            return true;
        }
        this.router.navigate(['/deny']);
        return false;
        // return user.user_type === 1;
    }
}


// tslint:disable-next-line:max-classes-per-file
@Injectable()
export class MasterGuard implements CanActivate {
    constructor(private router: Router, private http: HttpClient, private jwtService: JwtService, private storage: StorageService) { }

    private config = {
        view: ['view', 'detail'],
        edit: ['edit'],
        create: ['create'],
    };

    checkPermission(route) {
        return Object.keys(this.config).find(key => {
            return this.config[key].find(item => route.indexOf(item) !== -1);
        });
    }

    getUserPermission() {
        return new Promise((resolve, reject) => {
            const url = environment.commom_url + 'authentication/users/user-cache';
            const httpOptions = {
                headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.jwtService.getToken() }),
            };
            this.http.get(url, httpOptions).subscribe(res => {
                const listPerm = res['data'].permissions || [];
                this.storage.setData('permission', listPerm);
                resolve(true);
            }, err => {
                reject(false);
            });
        });
    }

    async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (!this.storage.getValue('permission')) {
            await this.getUserPermission();
        }

        const permission = this.storage.getValue('permission');
        const routePermission = this.storage.getPermission(state.url);
        const currentPageType = this.checkPermission(state.url) || 'list';

        if (currentPageType && Object.keys(routePermission).length !== 0) {
            if (permission.indexOf(routePermission[currentPageType]) === -1) {
                this.router.navigate(['/deny']);
                return false;
            }
        }
        return true;
    }
}
