import { environment } from './../../../../environments/environment';
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { JwtService } from '../../../shared';
import { HttpClient, HttpHeaders } from "@angular/common/http";
@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    pushRightClass: string = 'push-right';
    infoUser: any = {};

    constructor(private http: HttpClient, private translate: TranslateService, public router: Router, private JwtService: JwtService) {

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

    ngOnInit() {
        let user = (localStorage.getItem('currentUser'));
        if (user) {            
            this.infoUser = JSON.parse(user);
        }
        else{
            if (this.JwtService.getToken()) this.getUserDetail();
        }
        
    }

    getUserDetail() {
        let url = environment.api_url + 'auth/wms-user';
        let httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.JwtService.getToken() }),
        }
        this.http.get(url, httpOptions).subscribe(res => {
            this.infoUser = res['data']['user'];
            localStorage.setItem('currentUser', JSON.stringify(res['data']['user']));
        })
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
        this.JwtService.cleanLocalStorage();
    }

    changeLang(language: string) {
        this.translate.use(language);
    }
    onlogOut(){       
        this.JwtService.cleanLocalStorage();
        window.location.href='http://nab.qc.seldatdirect.com';
    }
}
