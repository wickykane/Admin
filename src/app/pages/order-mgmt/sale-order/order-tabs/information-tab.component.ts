import { TableService } from './../../../../services/table.service';
import { Component, OnInit, ViewContainerRef, Input } from '@angular/core';
import { Form, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { OrderService } from '../../../order-mgmt/order-mgmt.service';


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

    public detail = {
        'total_paid': null,
        subs: [],
        buyer_info: [],
        billing: []
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
                this.detail.billing = res.data.billing_info[0];
                if (this.detail.total_paid === null) {
                    this.detail.total_paid = 0;
                }
                this.detail.subs = res.data.subs;
                console.log(this.detail);
                this.detail.subs.forEach( (item) => {
                    this.totalQTY += item.qty;
                    this.totalShipQTY += item.qty_shipped;
                });
                this.detail.buyer_info = res.data.buyer_info;

            } catch (e) {
                console.log(e);
            }
        });
    }

}
