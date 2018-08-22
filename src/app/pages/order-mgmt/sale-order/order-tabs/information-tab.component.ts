import { Component, EventEmitter, Input, OnInit, Output, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { OrderService } from '../../../order-mgmt/order-mgmt.service';
import { TableService } from './../../../../services/table.service';


@Component({
    selector: 'app-order-info-tab',
    templateUrl: './information-tab.component.html',
    styleUrls: ['./order-tab.component.scss'],
    providers: [OrderService]
})
export class SaleOrderInformationTabComponent implements OnInit {

    /**
     * letiable Declaration
     */

    public _orderId;
    public _orderDetail;
    @Input() set orderId(id) {
        if (id) {
            this._orderId = id;
        }
    }

    @Input() set orderDetail(obj) {
        this._orderDetail = obj;
    }

    @Output() stockValueChange = new EventEmitter();

    public detail = {
        'billing': {},
        'shipping': {},
        'subs': []
    };
    public addr_select = {
        shipping: {
            'address_name': '',
            'address_line': '',
            'country_name': '',
            'city_name': '',
            'state_name': '',
            'zip_code': ''
        },
        billing: {
            'address_name': '',
            'address_line': '',
            'country_name': '',
            'city_name': '',
            'state_name': '',
            'zip_code': ''
        },
        contact: {
            'phone': '',
            'email': ''
        }
    };
    data = {};
    public totalQTY = 0;
    public totalShipQTY = 0;

    constructor(
        public fb: FormBuilder,
        public toastr: ToastrService,
        private router: Router,
        private vRef: ViewContainerRef,
        public tableService: TableService,
        private orderService: OrderService) {
    }

    ngOnInit() {
        this.getList();

    }

    /**
     * Internal Function
     */

    getList() {

        this.orderService.getOrderDetail(this._orderId).subscribe(res => {
            try {
                this.detail = res.data;
                this.stockValueChange.emit(res.data);

                this.detail['billing'] = (res.data.billing_address === null) ? _.cloneDeep(this.addr_select.billing) : res.data.billing_address[0];
                this.detail['shipping'] = (res.data.shipping_address === null) ? _.cloneDeep(this.addr_select.shipping) : res.data.shipping_address[0];

                this.detail['subs'] = res.data.items;
                this.detail['subs'].forEach((item) => {
                    this.totalQTY += item.quantity;
                    this.totalShipQTY += item.qty_shipped;
                });


            } catch (e) {
                console.log(e);
            }
        });
    }

    putApproveOrder(order_id) {
        // const params = {'status_code': 'AP'};
        this.orderService.approveOrd(order_id).subscribe(res => {
            if (res.status) {
                this.toastr.success(res.message);
                setTimeout(() => {
                    this.router.navigate(['/order-management/sale-order']);
                }, 500);
            } else {
                this.toastr.error(res.message);
            }
        },
            err => {
                this.toastr.error(err.message);
            }
        );
    }

    updateStatusOrder(order_id, status) {
        this.orderService.updateStatusOrder(order_id, status).subscribe(res => {
            if (res.status) {
                this.toastr.success(res.message);
                setTimeout(() => {
                    this.router.navigate(['/order-management/sale-order']);
                }, 500);
            } else {
                this.toastr.error(res.message);
            }
        },
            err => {
                this.toastr.error(err.message);
            }
        );
    }

    cancel() {
      console.log('ab');
      this.router.navigate(['/order-management/sale-order']);
    }

}
