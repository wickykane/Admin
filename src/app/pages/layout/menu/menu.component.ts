import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

    MENU_CONSTANT = [];

    showMenu: string = '';


    constructor(private translate: TranslateService, public router: Router) {

    }

    ngOnInit() {
        this.MENU_CONSTANT = [
            {
                flag: '',
                link: '/home',
                main_name: 'Home',
                icon: 'fa fa-home',
                sub: false,
                child: []
            },
            {
                flag: 'dashboard',
                link: '/',
                main_name: 'Dashboard',
                icon: '',
                sub: true,
                child: [
                    {
                        link: '/dashboard',
                        name: 'Promotion Dashboard'
                    },
                    {
                        link: '/blank-pag',
                        name: 'Overall Dashboard'
                    }
                ]
            },
            {
                flag: 'purchase',
                link: '/',
                main_name: 'Purchasing Management',
                icon: '',
                sub: true,
                child: [
                    {
                        link: '/dashboards',
                        name: 'Purchase Order'
                    },
                    {
                        link: '/blank-page',
                        name: 'Purchase Quotation'
                    }
                ]
            }
        ]
    }


    addExpandClass(element: any) {
        if (element === this.showMenu) {
            this.showMenu = '0';
        } else {
            this.showMenu = element;
        }
    }


}
