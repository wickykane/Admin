import { Component, EventEmitter, Input, OnInit, Output, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as _ from 'lodash';
import { OrderService } from '../../../order-mgmt/order-mgmt.service';
import { TableService } from './../../../../services/table.service';


@Component({
    selector: 'app-sale-quote-info-tab',
    templateUrl: './quote-info.component.html',
    styleUrls: ['./order-tab.component.scss'],
    providers: [OrderService]
})
export class SaleQuoteInformationTabComponent implements OnInit {

    /**
     * letiable Declaration
     */

    public _detailOrder;
    @Input() set detailOrder(data) {
        if (data && (!_.isEmpty(data))) {
            this.detail = data;
            this.detail['subs'] = data.list.items;
            this.detail['subs'].forEach( (item) => {
                this.totalQTY += item.quantity;

            });
            this.detail['buyer_info'] = data.buyer_info;
        }
    }

    public detail = {
        'billing': {},
        'shipping_address': {},
        'subs': [],
        'buyer_info': {}
    };
    data = {};
    public  totalQTY = 0;
    public totalShipQTY = 0;

    constructor(
        public fb: FormBuilder,
        private vRef: ViewContainerRef,
        public tableService: TableService,
        private orderService: OrderService) {
    }

    ngOnInit() {

    }
}
