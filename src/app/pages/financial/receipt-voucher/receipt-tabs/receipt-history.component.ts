import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FinancialService } from '../../financial.service';

import { TableService } from './../../../../services/table.service';

@Component({
    selector: 'app-receipt-history-tab',
    templateUrl: './receipt-history.component.html',
    styleUrls: ['./receipt-history.component.scss'],
    providers: [FinancialService]
})
export class ReceiptHistoryTabComponent implements OnInit {

    /**
     * letiable Declaration
     */
    public _receiptId;
    @Input() set receiptId(id) {
        if (id) {
            this._receiptId = id;
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
        private financialService: FinancialService,
    ) {
        //  Assign get list function name, override letiable here
        this.tableService.getListFnName = 'getList';
        this.tableService.context = this;
    }

    ngOnInit() {
        this.listMaster['timeline'] = [];
    }

    /**
     * Internal Function
     */

    getList() {
        const params = {...this.tableService.getParams()};
        Object.keys(params).forEach((key) => (params[key] === null || params[key] ===  '') && delete params[key]);

        this.financialService.getReceiptVoucherHistory(this._receiptId).subscribe(res => {
            try {
                this.listMaster['timeline'] = res.data;
            } catch (e) {
                console.log(e);
            }
        });
    }

}
