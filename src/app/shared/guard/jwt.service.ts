import { Injectable } from '@angular/core';
@Injectable()
export  class JwtService {

    jwtTokenKey = 'id_token';
    getToken(): string {
        return window.localStorage[this.jwtTokenKey];
    }

    saveToken(token: string) {
        window.localStorage[this.jwtTokenKey] = token;
    }

    destroyToken() {
        window.localStorage.removeItem(this.jwtTokenKey);
    }

    destroyAll() {
        window.localStorage.removeItem(this.jwtTokenKey);
        window.localStorage.removeItem('currentUser');
    }

    destroyUser() {
        window.localStorage.removeItem( 'currentUser' );
        window.localStorage.removeItem( 'group_permissions' );
        window.localStorage.removeItem( 'enable_permissions' );
    }

    cleanLocalStorage() {
        window.localStorage.clear();
    }

}
