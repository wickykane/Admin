import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '../../customer.service';
import { TableService } from './../../../../services/table.service';


@Component({
    selector: 'app-customer-shipment-tab',
    templateUrl: './shipment-tab.component.html',
    styleUrls: ['./information-tab.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerShipmentTabComponent implements OnInit {

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
        private customerService: CustomerService, private cd: ChangeDetectorRef) {

        this.searchForm = fb.group({
            'buyer_name': [null],
            'email': [null],
            'buyer_type': [null],
            'from': [null],
            'to': [null]
        });

        //  Assign get list function name, override letiable here
        this.tableService.getListFnName = 'getList';
        this.tableService.context = this;
    }

    ngOnInit() {}

    /**
     * Internal Function
     */
     refresh() {
         this.cd.detectChanges();
     }

    getList() {
        const params = {...this.tableService.getParams(), ...this.searchForm.value};
        Object.keys(params).forEach((key) => (params[key] === null || params[key] ===  '') && delete params[key]);

        this.customerService.getListInvoice(params).subscribe(res => {
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
