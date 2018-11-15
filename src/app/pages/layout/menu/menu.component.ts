import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { CommonService } from '../../../services/index';
import { ROUTE_PERMISSION } from '../../../services/route-permission.config';
import { StorageService } from '../../../services/storage.service';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss'],
    providers: [HotkeysService, CommonService],
})
export class MenuComponent implements OnInit {
    MENU_CONSTANT = [];
    @ViewChild('.open') open;
    public showMenu = '';

    constructor(
        private translate: TranslateService,
        public router: Router,
        public _hotkeysService: HotkeysService,
        private elRef: ElementRef,
        public commonService: CommonService,
        private storage: StorageService,
    ) {

    }

    routePerm = (route) => {
        return (this.storage.getRoutePermission(route) || {}).list;
    }

    ngOnInit() {
        this.initKeyMenu();
        this.MENU_CONSTANT = [
            {
                flag: '',
                link: '/guide',
                main_name: '',
                icon: 'fa fa-home',
                sub: false,
                child: [],
                permission: true
            },
            {
                flag: 'order',
                link: '/',
                main_name: 'Sales Management',
                icon: '',
                sub: true,
                child: [
                    {
                        link: '/order-management/sale-quotation',
                        name: 'Sales <u>Q</u>uotation',
                        permission: this.routePerm('/order-management/sale-quotation')
                    },
                    {
                        link: '/order-management/sale-order',
                        name: 'Sales <u>O</u>rders',
                        permission: this.routePerm('/order-management/sale-order')
                    },
                    {
                        link: '/order-management/return-order',
                        name: 'Return Orders',
                        permission: this.routePerm('/order-management/return-order')
                    }
                ],
                permission: this.routePerm('/order-management/sale-quotation') ||  this.routePerm('/order-management/sale-order') || this.routePerm('/order-management/return-order')
            },
            {
                flag: 'customer',
                link: '/',
                main_name: 'Customers Management',
                icon: '',
                sub: true,
                child: [
                    {
                        link: '/customer',
                        name: 'Customer',
                        permission: this.routePerm('/customer')
                    }

                ],
                permission: this.routePerm('/customer')
            },
            {
                flag: 'product',
                link: '/',
                main_name: 'Products Management',
                icon: '',
                sub: true,
                child: [
                    {
                        link: '/product-management/part-list',
                        name: '<u>P</u>art Management ',
                        permission: this.routePerm('/product-management/part-list')
                    },
                    {
                        link: '/product-management/item-list',
                        name: '<u>I</u>nventory Items',
                        permission: this.routePerm('/product-management/item-list')
                    },
                    {
                        link: '/product-management/miscellaneous-list',
                        name: 'Miscellaneous Items',
                        permission: this.routePerm('/product-management/miscellaneous-list')
                    }
                ],
                permission: this.routePerm('/product-management/part-list') ||  this.routePerm('/product-management/item-list') || this.routePerm('/product-management/miscellaneous-list')
            },
            {
                flag: 'financial',
                link: '/',
                main_name: 'Financial',
                icon: '',
                sub: true,
                child: [
                    {
                        link: '/financial/invoice',
                        name: 'AR Invoice',
                        permission: this.routePerm('/financial/invoice')
                    },
                    {
                        link: '/financial/receipt-voucher',
                        name: 'Receipt Voucher ',
                        permission: this.routePerm('/financial/receipt-voucher')
                    },
                    {
                        link: '/financial/credit-memo',
                        name: 'Credit Memo',
                        permission: this.routePerm('/financial/credit-memo')
                    },
                    {
                        link: '/financial/debit-memo',
                        name: 'Debit Memo',
                        permission: this.routePerm('/financial/debit-memo')
                    }
                ],
                permission: this.routePerm('/financial/invoice') ||  this.routePerm('/financial/receipt-voucher') || this.routePerm('/financial/credit-memo') || this.routePerm('/financial/debit-memo')
            },
            {
                flag: 'report',
                link: '/',
                main_name: 'Report',
                icon: '',
                sub: true,
                child: [
                    {
                        link: '/report/sales',
                        name: 'Sales',
                        permission: true

                    },
                    {
                        link: '/report/finance-report',
                        name: 'Finance ',
                        permission: true

                    },
                ],
                permission: true
            },
            // {
            //     flag: 'rma',
            //     link: '/rma',
            //     main_name: 'Return Order',
            //     icon: '',
            //     sub: false,
            //     child: []
            // },
            {
                flag: 'admin-panel',
                link: '/admin-panel',
                main_name: 'Admin Panel',
                icon: '',
                sub: false,
                child: [],
                permission: true
            }
            // ,
            // {
            //     flag: 'report',
            //     link: '/dashboard/reports',
            //     main_name: 'R<u>e</u>port',
            //     icon: '',
            //     sub: false,
            //     child: []
            // }
        ];
    }

    initKeyMenu() {
        this._hotkeysService.add(new Hotkey('shift+alt+q', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            (document.activeElement as HTMLElement).blur();
            this.router.navigate(['/order-management/sale-quotation']);
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Menu > Sale Quotation'));

        this._hotkeysService.add(new Hotkey('shift+alt+o', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            (document.activeElement as HTMLElement).blur();
            this.router.navigate(['/order-management/sale-order']);
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Menu > Sale Order'));

        this._hotkeysService.add(new Hotkey('shift+alt+p', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            (document.activeElement as HTMLElement).blur();
            this.router.navigate(['/product-management/part-list']);
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Menu > Part Management'));

        this._hotkeysService.add(new Hotkey('shift+alt+i', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            (document.activeElement as HTMLElement).blur();
            this.router.navigate(['/product-management/item-list']);
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Menu > Inventory Items'));

    }

    addExpandClass(element: any, e) {
        const el = this.elRef.nativeElement.querySelectorAll('.open');
        // el.forEach(item => {
        //     item.classList.remove('open');
        // });

        for (let i = 0; i < el.length; i++) {
            el[i].classList.remove('open');
        }

        this.showMenu = element === this.showMenu ? '0' : element;
    }

    removeClassExpand() {
        //  this.expand.nativeElement.classList.remove();
    }
}
