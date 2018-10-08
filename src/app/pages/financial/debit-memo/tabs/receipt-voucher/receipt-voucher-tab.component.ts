import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TableService } from './../../../../../services/table.service';

@Component({
    selector: 'app-receipt-voucher-tab',
    templateUrl: './receipt-voucher-tab.component.html',
    styleUrls: ['./receipt-voucher-tab.component.scss'],
    providers: []
})
export class ReceiptVoucherTabComponent implements OnInit {

    /**
     * letiable Declaration
     */

    public _orderId;
    @Input() set orderId(id) {
        if (id) {
            this._orderId = id;
            // this.getList();
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
        public tableService: TableService
      ) {
        //  Assign get list function name, override letiable here
        this.tableService.getListFnName = 'getList';
        this.tableService.context = this;
    }

    ngOnInit() {}

    /**
     * Internal Function
     */

    // getList() {
    //     const params = {...this.tableService.getParams()};
    //     Object.keys(params).forEach((key) => (params[key] === null || params[key] ===  '') && delete params[key]);

    //     this.orderService.getInvoice( this._orderId).subscribe(res => {
    //         try {
    //             this.list.items = [] || res.data.rows;
    //             this.tableService.matchPagingOption(res.data);
    //         } catch (e) {
    //             console.log(e);
    //         }
    //     });
    // }

}
