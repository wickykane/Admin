import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '../customer.service';
import { TableService } from './../../../services/table.service';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { routerTransition } from '../../../router.animations';
import { ConfirmModalContent } from '../../../shared/modals/confirm.modal';

@Component({
    selector: 'app-buyer',
    templateUrl: './customer.component.html',
    styleUrls: ['./customer.component.scss'],
    animations: [routerTransition()]
})
export class CustomerComponent implements OnInit {

    /**
     * letiable Declaration
     */
    public listMaster = {};
    public selectedIndex = 0;
    public onoffFilter: any;
    public list = {
        items: []
    };
    public showProduct = false;
    public flagId = '';

    public user: any;
    public listMoreFilter: any = [];

    searchForm: FormGroup;

    constructor(public router: Router,
        public fb: FormBuilder,
        public toastr: ToastrService,
        private vRef: ViewContainerRef,
        public tableService: TableService,
        private modalService: NgbModal,
        private customerService: CustomerService) {

        this.searchForm = fb.group({
            'buyer_name': [null],
            'email': [null],
            'buyer_type': [null]
        });

        //  Assign get list function name, override letiable here
        this.tableService.getListFnName = 'getList';
        this.tableService.context = this;
    }

    ngOnInit() {
        //  Init Fn
        this.getList();
        this.listMaster['buyerType'] = [{
            id: 'CP',
            name: 'Company'
        }, {
            id: 'PS',
            name: 'Personal'
        }];

        this.user = JSON.parse(localStorage.getItem('currentUser'));
    }
    /**
     * Table Event
     */
    selectData(index) {
        console.log(index);
    }
    /**
     * Internal Function
     */
    delete(id) {
        const modalRef = this.modalService.open(ConfirmModalContent);
        modalRef.result.then(yes => {
            if (yes) {
                this.customerService.deleteBuyer(id).subscribe(res => {
                    try {
                        this.toastr.success(res.message);
                        this.getList();
                    } catch (e) {
                        console.log(e);
                    }
                });
            }
        });
        modalRef.componentInstance.message = 'Are you sure you want to delete ?';
    }

    getList() {
        const params = {...this.tableService.getParams(), ...this.searchForm.value};
        Object.keys(params).forEach((key) => {
            if (key !== 'email' && (params[key] === null || params[key] === '' )) {
                 delete params[key];
                }
            if (params['email'] === null || params['email'] === '' || String(params['email']).trim() === '') {
                delete params['email'];
            }
        });

        this.customerService.getListBuyer(params).subscribe(res => {
            try {
                this.list.items = res.data.rows;
                this.tableService.matchPagingOption(res.data);
            } catch (e) {
                console.log(e);
            }
        });
    }

}
