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

    ngOnInit() {
        const routePermission = { ...ROUTE_PERMISSION['menu'] };
        const userPermission = this.storage.getValue('permission');
        Object.keys(routePermission).forEach(item => {
            routePermission[item] = (userPermission.indexOf(item) !== -1) ? true : false;
        });
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
                        permission: routePermission['sel2bViewMenuSaleQuotation']
                    },
                    {
                        link: '/order-management/sale-order',
                        name: 'Sales <u>O</u>rders',
                        permission: routePermission['sel2bViewMenuSaleOrder']
                    },
                    {
                        link: '/order-management/return-order',
                        name: 'Return Orders',
                        permission: routePermission['sel2bViewMenuReturnOrder']
                    }
                ],
                permission: routePermission['sel2bViewMenuSaleQuotation'] || routePermission['sel2bViewMenuSaleOrder'] || routePermission['sel2bViewMenuReturnOrder']
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
                        permission: routePermission['sel2bViewMenuCustomer']
                    }

                ],
                permission: routePermission['sel2bViewMenuCustomer']
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
                        permission: routePermission['sel2bViewMenuPartManagement']
                    },
                    {
                        link: '/product-management/item-list',
                        name: '<u>I</u>nventory Items',
                        permission: routePermission['sel2bViewMenuInventory']
                    },
                    {
                        link: '/product-management/miscellaneous-list',
                        name: 'Miscellaneous Items',
                        permission: routePermission['sel2bViewMenuMiscellaneousItem']
                    }
                ],
                permission: routePermission['sel2bViewMenuPartManagement'] || routePermission['sel2bViewMenuInventory'] || routePermission['sel2bViewMenuMiscellaneousItem']
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
                        permission: routePermission['sel2bViewMenuARInvoice']
                    },
                    {
                        link: '/financial/receipt-voucher',
                        name: 'Receipt Voucher ',
                        permission: routePermission['sel2bViewMenuReceiptVoucher']
                    },
                    {
                        link: '/financial/credit-memo',
                        name: 'Credit Memo',
                        permission: routePermission['sel2bViewMenuCreditMemo']
                    },
                    {
                        link: '/financial/debit-memo',
                        name: 'Debit Memo',
                        permission: routePermission['sel2bViewMenuDebitMemo']
                    }
                ],
                permission: routePermission['sel2bViewMenuARInvoice'] || routePermission['sel2bViewMenuReceiptVoucher'] || routePermission['sel2bViewMenuCreditMemo'] || routePermission['sel2bViewMenuDebitMemo']
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
