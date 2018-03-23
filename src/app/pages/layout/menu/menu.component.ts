import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

    MENU_CONSTANT = [];
     @ViewChild('.expand') expand;
    showMenu: string = '';


    constructor(private translate: TranslateService, public router: Router) {

    }

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
                        link: '/purchase-management/purchase-quotation',
                        name: 'Purchase Quotation'
                    },
                    {
                        link: '/sd',
                        name: 'Purchase Orders'
                    },
                    {
                        link: '/d-page',
                        name: 'Inbound Delivery Orders'
                    },
                    {
                        link: '/asdf',
                        name: 'Warehouse Receipt'
                    },
                    {
                        link: '/233',
                        name: 'Suppliers'
                    }
                ]
            },
            {
                flag: 'order',
                link: '/',
                main_name: 'Sales Management',
                icon: '',
                sub: true,
                child: [
                    {
                        link: '/order-management/buyer-rfq',
                        name: 'Buyer RFQ'
                    },
                    {
                        link: '/sdw',
                        name: 'Sales Quotation'
                    },
                    {
                        link: '/dd',
                        name: 'Sales Orders'
                    },
                    {
                        link: '/asdf',
                        name: 'Delivery Orders'
                    },
                    {
                        link: '/23s3',
                        name: 'Sales Price List'
                    }
                ]
            },
            {
                flag: 'promotion',
                link: '/',
                main_name: 'Promotion Management',
                icon: '',
                sub: true,
                child: [
                    {
                        link: '/promotion/budget',
                        name: 'Promotion Budget'
                    },
                    {
                        link: '/sdsw',
                        name: 'Promotion Campaign'
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
                        link: '/saswaa',
                        name: 'Buyers'
                    },
                    {
                        link: '/sd',
                        name: 'Customer Segments'
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
                        link: '/product-management/item-list',
                        name: 'Item List '
                    },
                    {
                        link: '/product-management/product-definition',
                        name: 'Product Definition'
                    },
                    {
                        link: '/product-management/bundle',
                        name: 'Bundle Management'
                    },
                    {
                        link: '/product-management/condition-product',
                        name: 'Conditional Product Groups'
                    },
                    {
                        link: '/product-management/e-catalog',
                        name: 'E-Catalog'
                    }
                ]
            },
            {
                flag: 'delivery',
                link: '/',
                main_name: 'Delivery Management',
                icon: '',
                sub: true,
                child: [
                    {
                        link: '/sa2wa',
                        name: 'Dashboard'
                    },
                    {
                        link: '/s3sdw',
                        name: 'Delivery Order'
                    },
                    {
                        link: '/d3ds',
                        name: 'Routes'
                    },
                    {
                        link: '/assd3f',
                        name: 'Trucks   '
                    },
                    {
                        link: '/23s3s3',
                        name: 'Truck Types'
                    },
                    {
                        link: '/s',
                        name: 'Drivers'
                    }
                ]
            },
            {
                flag: '',
                link: '/admin-panel',
                main_name: 'Admin Panel',
                icon: '',
                sub: false,
                child: []
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

    removeClassExpand() {
        this.expand.nativeElement.classList.remove();
    }


}
