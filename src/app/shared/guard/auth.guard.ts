import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { StorageService } from '../../services/storage.service';
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
export class MasterGuard implements CanActivate {
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
