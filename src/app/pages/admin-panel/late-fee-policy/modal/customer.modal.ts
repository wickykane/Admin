import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TableService } from './../../../../services/table.service';

import { CustomerService } from '../../../customer-mgmt/customer.service';
import { LateFeePolicyService } from '../late-fee-policy.service';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-customer-modal-content',
    templateUrl: './customer.modal.html',
    providers: [CustomerService, LateFeePolicyService]
})
// tslint:disable-next-line:component-class-suffix
export class CustomerModalContent implements OnInit {
    @Input() id;
    @Input() flagBundle;

    /**
     * Variable Declaration
     */
    public listMaster = {};
    public selectedIndex = 0;
    public list = {
        items: [],
        checklist: []
    };
    public checkAllItem;
    public data = {};
    public searchForm: FormGroup;
    public filterForm: FormGroup;

    constructor(public activeModal: NgbActiveModal,
        public customerService: CustomerService,
        public lateFeePolicyService: LateFeePolicyService,
        public fb: FormBuilder,
        public toastr: ToastrService,
        public tableService: TableService) {

        this.searchForm = fb.group({
            'cus_name': [null],
            'cus_code': [null],
            'cus_type': [null]
        });

        //  Assign get list function name, override variable here
        this.tableService.getListFnName = 'getList';
        this.tableService.context = this;
    }

    ngOnInit() {
        //  Init Fn
        this.listMaster['buyerType'] = [
            { code: "CP", name: "Company" },
            { code: "PS", name: "Personal" }
        ];
        this.getList();
    }

    // Table event
    selectData(index) {
        console.log(index);
    }

    checkAll(ev) {
        this.list.items.forEach(x => x.is_checked = ev.target.checked);
        this.list.checklist = this.list.items.filter(_ => _.is_checked);
    }

    isAllChecked() {
        this.checkAllItem = this.list.items.every(_ => _.is_checked);
        this.list.checklist = this.list.items.filter(_ => _.is_checked);
    }

    /**
     * Internal Function
     */

    getListCustomerType() {
        this.lateFeePolicyService.getListCustomerType().subscribe(res => {
            try {
                this.listMaster['buyerType'] = res.data;
            } catch (e) {
                console.log(e);
            }
        });
    }

    getList() {
        const params = { ...this.tableService.getParams(), ...this.searchForm.value };
        Object.keys(params).forEach((key) => (params[key] === null || params[key] === '') && delete params[key]);

        this.lateFeePolicyService.getListCustomer(params).subscribe(res => {
            try {
                this.list.items = res.data.rows;
                this.tableService.matchPagingOption(res.data);
            } catch (e) {
                console.log(e);
            }
        });
    }

    convertCustomerType(code) {
        const type = this.listMaster['buyerType'].find(item => item.code === code);
        return type.name;
    }

}
