import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '../../customer.service';

import { NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { TableService } from '../../../../services/table.service';


@Component({
    selector: 'app-customer-customer-balance-tab',
    templateUrl: './customer-balance-tab.component.html',
    styleUrls: ['./information-tab.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerCustomerBalanceTabComponent implements OnInit {

    /**
     * letiable Declaration
     */

    public _customerId;
    public listReference: any;
    @Input() set customerId(id) {
        if (id) {
            this._customerId = id;
            this.getList();
        }
    }

    public listMaster = {};

    public list: any;

    searchForm: FormGroup;

    constructor(
        public fb: FormBuilder,
        private vRef: ViewContainerRef,
        public tableService: TableService,
        private customerService: CustomerService, private cd: ChangeDetectorRef,
        private modalService: NgbModal) {

        this.searchForm = fb.group({
            'subsidiary': [null],
            'year': [null]
        });

        //  Assign get list function name, override letiable here
        this.tableService.getListFnName = 'getList';
        this.tableService.context = this;
    }

    ngOnInit() {
        this.getListReference();
    }

    /**
     * Internal Function
     */

    refresh() {
         if (!this.cd['destroyed']) { this.cd.detectChanges(); }
    }

    getListReference() {
        this.customerService.getListCustomerBalanceReference().subscribe(res => {
            try {
                console.log(res);
                this.listReference = res.data;
                this.refresh();
            } catch (e) {
                console.log(e);
            }
        });
    }
    getList() {
        const params = { ...this.searchForm.value };
        Object.keys(params).forEach((key) => (params[key] === null || params[key] === '') && delete params[key]);

        this.customerService.getListCustomerBalance(this._customerId, params).subscribe(res => {
            try {
                this.list =  res.data;
                console.log(this.list);
                // this.tableService.matchPagingOption(res.data);
                this.refresh();
            } catch (e) {
                console.log(e);
            }
        });
    }
    checkRelated(item) {
        return Array.isArray(item);
       }
       openVerticallyCentered(contenlink) {
        this.modalService.open(contenlink);
      }
}
