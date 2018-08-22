import { Component, EventEmitter, Input, OnInit, Output, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as _ from 'lodash';
import { OrderService } from '../../../order-mgmt/order-mgmt.service';
import { TableService } from './../../../../services/table.service';


@Component({
    selector: 'app-quote-info-tab',
    templateUrl: './information-tab.component.html',
    styleUrls: ['./quote-tab.component.scss'],
    providers: [OrderService]
})
export class QuoteInformationTabComponent implements OnInit {

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
        'shipping_address': {},
        'items': [],
        'buyer_info': {}
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
        this.orderService.getSaleQuoteDetail(this._orderId).subscribe(res => {
            try {
                this.detail = res.data;
                this.stockValueChange.emit(res.data);
                // if (res.data.is_draft_order) {
                //     this.detail['shipping_address'] = (res.data.shipping_address.length === 0) ? _.cloneDeep(this.addr_select.shipping) : res.data.shipping_address[0];
                //     this.detail['billing'] = (res.data.billing_info.length === 0) ? _.cloneDeep(this.addr_select.billing) : this.detail['billing'] = res.data.billing_info[0];
                // } else {
                //     this.detail['billing'] = res.data.billing_info[0];
                //     this.detail['shipping_address'] = res.data.shipping_address[0];
                // }
                // if (this.detail['total_paid'] === null) {
                //     this.detail['total_paid'] = 0;
                // }
                // this.detail['subs'] = res.data.list.items;
                // this.detail['subs'].forEach((item) => {
                //     this.totalQTY += item.quantity;
                //     this.totalShipQTY += item.qty_shipped;
                // });
                // this.detail['buyer_info'] = res.data.buyer_info;
                this.detail['buyer_info'] = {};
                this.detail['billing'] = {};
                this.detail['shipping'] = {};
                this.detail['shipping_address'] = {};

            } catch (e) {
                console.log(e);
            }
        });
    }

}
