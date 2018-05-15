import { TableService } from './../../../../services/table.service';
import { Component, OnInit, ViewContainerRef, Input } from '@angular/core';
import { Form, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { OrderService } from '../../../order-mgmt/order-mgmt.service';


@Component({
    selector: 'app-order-timeline-tab',
    templateUrl: './timeline-tab.component.html',
    styleUrls: ['./order-tab.component.scss'],
    providers: [OrderService]
})
export class SaleOrderTimelineTabComponent implements OnInit {

    /**
     * letiable Declaration
     */

    public order_code;
    @Input() set orderId(id) {
        if (id) {
            this.order_code = id;
            this.getList();
        }
    }
    public detail = {
        history: []
      };

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
        this.orderService.getHistoryByCode(this.order_code).subscribe(res => {
            try {

            } catch (e) {
                console.log(e);
            }
        });
    }

}
