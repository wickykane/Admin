import { Component, EventEmitter, Input, OnInit, Output, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
    @Input() set orderId(id) {
        if (id) {
            this._orderId = id;
        }
    }
    @Output() stockValueChange = new EventEmitter();

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
        this.getList();

    }

    /**
     * Internal Function
     */

    getList() {

        this.orderService.getOrderDetail(this._orderId).subscribe(res => {
            try {
                this.detail = res.data;
                this.stockValueChange.emit(res.data) ;
                this.detail['billing'] = res.data.billing_info[0];
                this.detail['shipping_address'] = res.data.shipping_address[0];
                if (this.detail['total_paid'] === null) {
                    this.detail['total_paid'] = 0;
                }
                this.detail['subs'] = res.data.subs;
                this.detail['subs'].forEach( (item) => {
                    this.totalQTY += item.qty;
                    this.totalShipQTY += item.qty_shipped;
                });
                this.detail['buyer_info'] = res.data.buyer_info;

            } catch (e) {
                console.log(e);
            }
        });
    }

}
