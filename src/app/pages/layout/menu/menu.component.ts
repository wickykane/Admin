import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

    MENU_CONSTANT = [];
     @ViewChild('.open') open;
    showMenu: string = '';


    constructor(private translate: TranslateService, public router: Router, private elRef:ElementRef) {

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
                        link: '/purchase-management/purchase-order',
                        name: 'Purchase Orders'
                    },
                    {
                        link: '/purchase-management/inbound-delivery',
                        name: 'Inbound Delivery Orders'
                    },
                    {
                        link: '/purchase-management/warehouse-receipt',
                        name: 'Warehouse Receipt'
                    },
                    {
                        link: '/purchase-management/supplier',
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
                        link: '/order-management/sale-quotation',
                        name: 'Sales Quotation'
                    },
                    {
                        link: '/order-management/sale-order',
                        name: 'Sales Orders'
                    },
                    {
                        link: '/asdf',
                        name: 'Delivery Orders'
                    },
                    {
                        link: '/order-management/sales-price',
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
                        link: '/promotion/campaign',
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
                        link: '/customer/buyer',
                        name: 'Buyers'
                    },
                    {
                        link: '/customer/customer-segment',
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
                        link: '/fulfillment/schedule',
                        name: 'Dashboard'
                    },
                    {
                        link: '/fulfillment/delivery-order',
                        name: 'Delivery Order'
                    },
                    {
                        link: '/fulfillment/route',
                        name: 'Routes'
                    },
                    {
                        link: '/fulfillment/truck',
                        name: 'Trucks   '
                    },
                    {
                        link: '/fulfillment/truck-type',
                        name: 'Truck Types'
                    },
                    {
                        link: '/fulfillment/driver',
                        name: 'Drivers'
                    }
                ]
            },
            {
                flag: 'admin-panel',
                link: '/admin-panel',
                main_name: 'Admin Panel',
                icon: '',
                sub: false,
                child: []
            }
        ]
    }


    addExpandClass(element: any, e) {
        let el = this.elRef.nativeElement.querySelectorAll('.open');

        for (var i = 0; i < el.length; i++) {
               el[i].classList.remove('open');
          }


        if (element === this.showMenu) {
            this.showMenu = '0';
        } else {
            this.showMenu = element;
        }
    }

    removeClassExpand() {
        // this.expand.nativeElement.classList.remove();
    }


}
