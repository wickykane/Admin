import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '../../customer.service';
import { TableService } from './../../../../services/table.service';


@Component({
    selector: 'app-customer-receipt-voucher-tab',
    templateUrl: './receipt-voucher-tab.component.html',
    styleUrls: ['./information-tab.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerReceiptVoucherTabComponent implements OnInit {

    /**
     * letiable Declaration
     */

    public _customerId;
    @Input() set customerId(id) {
        if (id) {
            this._customerId = id;
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
        private customerService: CustomerService,
        private cd: ChangeDetectorRef) {

        this.searchForm = fb.group({
            'receipt_no': [null],
            'payment_method': [null],
            'customer_id': [null],
            'electronic': [null],
            'status': [null],
            'date_type': [null],
            'date_from': [null],
            'date_to': [null]
        });

        //  Assign get list function name, override letiable here
        this.tableService.getListFnName = 'getList';
        this.tableService.context = this;
    }

    ngOnInit() {
      this.getList();
    }

    /**
     * Internal Function
     */
     refresh() {
         this.cd.detectChanges();
     }

    getList() {
        const params = {...this.tableService.getParams(), ...this.searchForm.value};
        Object.keys(params).forEach((key) => (params[key] === null || params[key] ===  '') && delete params[key]);

        this.customerService.getListInvoice(this.customerId, params).subscribe(res => {
            try {
                this.list.items = [] || res.data.rows;
                this.tableService.matchPagingOption(res.data);
                this.refresh();
            } catch (e) {
                console.log(e);
            }
        });
    }

}
