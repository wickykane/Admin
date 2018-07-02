import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
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
