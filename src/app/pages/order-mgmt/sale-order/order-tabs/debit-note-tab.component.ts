import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrderService } from '../../../order-mgmt/order-mgmt.service';
import { TableService } from './../../../../services/table.service';


@Component({
    selector: 'app-order-debit-note-tab',
    templateUrl: './debit-note-tab.component.html',
    styleUrls: ['./order-tab.component.scss'],
    providers: [OrderService]
})
export class SaleOrderDebitNoteTabComponent implements OnInit {

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

    public listMaster = {};

    public list = {
        items: []
    };

    searchForm: FormGroup;

    constructor(
        public fb: FormBuilder,
        private vRef: ViewContainerRef,
        public tableService: TableService,
        private orderService: OrderService
      ) {
        //  Assign get list function name, override letiable here
        this.tableService.getListFnName = 'getList';
        this.tableService.context = this;
    }

    ngOnInit() {}

    /**
     * Internal Function
     */

    getList() {
        const params = {...this.tableService.getParams()};
        Object.keys(params).forEach((key) => (params[key] === null || params[key] ===  '') && delete params[key]);

        this.orderService.getInvoice( this._orderId).subscribe(res => {
            try {
                this.list.items = [] || res.data.rows;
                this.tableService.matchPagingOption(res.data);
            } catch (e) {
                console.log(e);
            }
        });
    }

}
