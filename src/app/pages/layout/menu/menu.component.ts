import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
    MENU_CONSTANT = [];
    @ViewChild('.open') open;
    public showMenu = '';

    constructor(
        private translate: TranslateService,
        public router: Router,
        private elRef: ElementRef
    ) { }

    ngOnInit() {
        this.MENU_CONSTANT = [
            {
                flag: '',
                link: '/guide',
                main_name: '',
                icon: 'fa fa-home',
                sub: false,
                child: []
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
                        name: 'Sales Quotation'
                    },
                    {
                        link: '/order-management/sale-order',
                        name: 'Sales Orders'
                    }
                ]
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
                        name: 'Customer'
                    }

                ]
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
                        name: 'Part Management '
                    },
                    {
                        link: '/product-management/item-list',
                        name: 'Inventory Items'
                    },
                    {
                        link: '/product-management/miscellaneous-list',
                        name: 'Miscellaneous Items'
                    }
                ]
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
                        name: 'AR Invoice'
                    },
                    {
                        link: '/financial/receipt-voucher',
                        name: 'Receipt Voucher '
                    },
                    {
                        link: '/financial/credit-memo',
                        name: 'Credit Memo'
                    },
                    {
                        link: '/financial/debit-memo',
                        name: 'Debit Memo'
                    }
                ]
            },
            {
                flag: 'rma',
                link: '/rma',
                main_name: 'Return Order',
                icon: '',
                sub: false,
                child: []
            },
            {
                flag: 'admin-panel',
                link: '/admin-panel',
                main_name: 'Admin Panel',
                icon: '',
                sub: false,
                child: []
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
