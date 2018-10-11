import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CreditMemoService } from './../credit-memo.service';
import { TableService } from './../../../../services/table.service';


@Component({
    selector: 'app-credit-history-tab',
    templateUrl: './credit-history.component.html',
    styleUrls: ['./credit-history.component.scss'],
    providers: [CreditMemoService]
})
export class CreditHistoryTabComponent implements OnInit {

    /**
     * letiable Declaration
     */

    public _creditHisId;
    @Input() set creditId(id) {
        if (id) {
            this._creditHisId = id;
            console.log(this._creditHisId );
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
        private creditMemoService: CreditMemoService
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

        this.creditMemoService.getCreditHistory(this._creditHisId).subscribe(res => {
            try {
                this.listMaster['timeline'] = res.data;
            } catch (e) {
                console.log(e);
            }
        });
    }

}
