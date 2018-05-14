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
            this.getList();
        }
    }

    public detail = {
        information: [],
        history: [],
        subs: [],
        general: [],
        buyer_info: [],
        billing: []
      };
      public linkIframe;
      public invList;
      data = {};
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
                this.detail.information = res.data.order_detail;
                this.detail['billing'] = res.data.billing_info[0];
                this.detail['general'] = res.data;
                this.detail['subs'] = res.data.subs;
                this.detail['buyer_info'] = res.data.buyer_info;              
                this.linkIframe = this.getSrcIframe(this.detail['general']['code']);
              } catch (e) {
                console.log(e);
              }
        });
    }

}
