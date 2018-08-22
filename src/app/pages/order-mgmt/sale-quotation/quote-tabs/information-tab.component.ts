import { Component, EventEmitter, Input, OnInit, Output, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
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
    public order_info = {};

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
        'contact_user': {},
        'billing': {},
        'shipping_address': {},
        'items': [],
    };

    constructor(
        public toastr: ToastrService,
        public fb: FormBuilder,
        private vRef: ViewContainerRef,
        public tableService: TableService,
        private orderService: OrderService) {
    }

    ngOnInit() {
        this.getList();
        this.order_info['taxs'] = [];
    }

    /**
     * Internal Function
     */

    getList() {
        this.orderService.getSaleQuoteDetail(this._orderId).subscribe(res => {
            try {
                this.detail = res.data;
                this.detail.shipping_address = res.data.shipping_id;
                this.detail.billing = res.data.billing_id;
                this.groupTax(this.detail.items);
                this.stockValueChange.emit(res.data);

            } catch (e) {
                console.log(e);
            }
        });
    }

    groupTax(items) {
        this.order_info['taxs'] = [];
        this.order_info['total_tax'] = 0;
        const taxs = items.map(item => item.tax_percent || 0);
        const unique = taxs.filter((i, index) => taxs.indexOf(i) === index);
        unique.forEach((tax, index) => {
            let taxAmount = 0;
            items.filter(item => item.tax_percent === tax).map(i => {
                taxAmount += (+i.tax_percent * +i.qty * (+i.price || 0) / 100);
            });
            this.order_info['total_tax'] = this.order_info['total_tax'] + taxAmount.toFixed(2);
            this.order_info['taxs'].push({
                value: tax, amount: taxAmount.toFixed(2)
            });
        });
    }

    updateStatus(status) {
        const params = { status };
        this.orderService.updateSaleQuoteStatus(this._orderId, params).subscribe(res => {
            try {
                this.toastr.success(res.message);
                this.getList();
            } catch (e) {
                console.log(e);
            }
        });
    }
}
