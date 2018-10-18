import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from '../../../services/storage.service';
import { JwtService } from '../../../shared';
import { environment } from './../../../../environments/environment';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    pushRightClass = 'push-right';
    infoUser: any = {};

    constructor(private storageService: StorageService, private http: HttpClient, private translate: TranslateService, public router: Router, private jwtService: JwtService) {

        this.translate.addLangs(['en', 'fr', 'ur', 'es', 'it', 'fa', 'de', 'zh-CHS']);
        this.translate.setDefaultLang('en');
        const browserLang = this.translate.getBrowserLang();
        this.translate.use(browserLang.match(/en|fr|ur|es|it|fa|de|zh-CHS/) ? browserLang : 'en');

        this.router.events.subscribe(val => {
            if (
                val instanceof NavigationEnd &&
                window.innerWidth <= 992 &&
                this.isToggled()
            ) {
                this.toggleSidebar();
            }
        });
    }

    async ngOnInit() {
        // const user = (localStorage.getItem('currentUser'));
        // if (user) {
        //     this.infoUser = JSON.parse(user);
        // } else {
        //     if (this.jwtService.getToken()) { this.getUserDetail(); }
        // }
        if (this.jwtService.getToken()) {
            await this.getUserDetail();
        }

    }

    getUserDetail() {
        return new Promise((resolve, reject) => {
            const url = environment.api_url + 'auth/wms-user';
            const httpOptions = {
                headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.jwtService.getToken() }),
            };
            this.http.get(url, httpOptions).subscribe(res => {
                this.infoUser = res['data']['user'];
                this.storageService.setData('user', res['data']['user']);
                localStorage.setItem('currentUser', JSON.stringify(res['data']['user']));
                resolve(true);
            }, err => {
                reject(false);
            });
        });

    }


    isToggled(): boolean {
        const dom: Element = document.querySelector('body');
        return dom.classList.contains(this.pushRightClass);
    }

    toggleSidebar() {
        const dom: any = document.querySelector('body');
        dom.classList.toggle(this.pushRightClass);
    }

    rltAndLtr() {
        const dom: any = document.querySelector('body');
        dom.classList.toggle('rtl');
    }

    onLoggedout() {
        this.jwtService.cleanLocalStorage();
    }

    changeLang(language: string) {
        this.translate.use(language);
    }
    onlogOut() {
        this.jwtService.cleanLocalStorage();
        window.location.href = environment.nab_url;
    }
    goToHome() {
        window.location.href = environment.nab_home;
    }
}
