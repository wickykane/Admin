import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrderService } from '../../../order-mgmt/order-mgmt.service';
import { CustomerService } from '../../customer.service';
import { TableService } from './../../../../services/table.service';


@Component({
    selector: 'app-customer-sale-order-tab',
    templateUrl: './sale-order-tab.component.html',
    styleUrls: ['./information-tab.component.scss'],
    providers: [OrderService],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerSaleOrderTabComponent implements OnInit {

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
        private orderService: OrderService, private cd: ChangeDetectorRef) {

        this.searchForm = fb.group({
            'code': [null],
            'cus_po': [null],
            'quote_no': [null],
            'type': [null],
            'sts': [null],
            'buyer_name': [null],
            'date_type': [null],
            'date_to': [null],
            'date_from': [null],
        });

        //  Assign get list function name, override letiable here
        this.tableService.getListFnName = 'getList';
        this.tableService.context = this;
    }

    ngOnInit() {
        this.getListStatus();
    }

    /**
     * Internal Function
     */
     refresh() {
         this.cd.detectChanges();
     }

    getListStatus() {
        this.orderService.getListStatus().subscribe(res => {
            this.listMaster['status'] = res.results;
            this.refresh();
        });
    }

    getList() {
        const params = {...this.searchForm.value};
        Object.keys(params).forEach((key) => (params[key] === null || params[key] ===  '') && delete params[key]);

        this.customerService.getListSO(this._customerId, params).subscribe(res => {
            try {
                this.list.items = res.data.rows || [];
                this.tableService.matchPagingOption(res.data);
                this.refresh();
            } catch (e) {
                console.log(e);
            }
        });
    }

}
