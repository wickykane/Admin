import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TableService } from './../../../../../services/table.service';

import { DebitMemoService } from '../../debit-memo.service';
@Component({
    selector: 'app-receipt-voucher-tab',
    templateUrl: './receipt-voucher-tab.component.html',
    styleUrls: ['./receipt-voucher-tab.component.scss'],
    providers: [DebitMemoService]
})
export class ReceiptVoucherTabComponent implements OnInit {

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
    @Input() set listItem(list) {
        if (list) {
            this.list = list;
            // this.getList();
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
        public debitService: DebitMemoService
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
        this.debitService.getReceiptVoucher( this._orderId).subscribe(res => {
            try {
                this.list.items =  res.data.rows;
            } catch (e) {
                console.log(e);
            }
        });
    }

}
