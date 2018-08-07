import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TableService } from './../../../../services/table.service';

import { environment } from '../../../../environments/environment';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { routerTransition } from '../../../../router.animations';

import { PaymentMethodsKeyService } from '../keys.control';
import { PaymentMethodsService } from '../payment-method.service';

@Component({
    selector: 'app-payment-methods-list',
    templateUrl: './payment-methods-list.component.html',
    styleUrls: ['./payment-methods-list.component.scss'],
    animations: [routerTransition()],
    providers: [PaymentMethodsKeyService, PaymentMethodsService]
})
export class PaymentMethodsListComponent implements OnInit {
    /**
     * letiable Declaration
     */
    public listMaster = {
        paymentTypes: [],
        status: [
            {
                key: null,
                name: '--Select--'
            },
            {
                key: 0,
                name: 'Inactive'
            },
            {
                key: 1,
                name: 'Active'
            }
        ]
    };
    public searchForm: FormGroup;
    public searchData = {};
    public paymentMethods = [];
    public isCheckedAllPaymentMethod = false;

    constructor(
        public router: Router,
        public fb: FormBuilder,
        public toastr: ToastrService,
        public tableService: TableService,
        public keyService: PaymentMethodsKeyService,
        public paymentMethodService: PaymentMethodsService
    ) {
        this.searchForm = fb.group({
            name: [null],
            type: [null],
            ac: [null]
        });
        this.tableService.getListFnName = 'getListPaymentMethods';
        this.tableService.context = this;
        //  Init Key
        this.keyService.watchContext.next(this);
    }

    ngOnInit() {
        this.getPaymentTypes();
        this.getListPaymentMethods();
    }
    /**
     * Table Event
     */
    selectData(index) {
        console.log(index);
    }

    onSearchList() {
        this.searchData = this.searchForm.value;
        this.getListPaymentMethods();
    }

    onResetList() {
        this.searchForm.reset();
        this.searchData = this.searchForm.value;
        this.getListPaymentMethods();
    }
    /**
     * Internal Function
     */
    getListPaymentMethods() {
        const params = { ...this.tableService.getParams(), ...this.searchData};
        Object.keys(params).forEach((key) => (params[key] === null || params[key] === '') && delete params[key]);
        this.paymentMethodService.getPaymentMethods(params).subscribe(
            res => {
                try {
                    this.paymentMethods = res.data.rows;
                    this.tableService.matchPagingOption(res.data);
                } catch (err) {
                    console.log(err);
                }
            },
            err => {
                console.log(err);
            }
        );
        console.log(this.searchData);
    }

    getPaymentTypes() {
        this.paymentMethodService.getPaymentTypes().subscribe(
          res => {
            try {
                this.listMaster.paymentTypes = res.data;
            } catch (err) {
                console.log(err);
            }
          },
          err => {
              console.log(err);
          }
        );
    }

    addNewPaymentMethod() {
        this.router.navigate(['/admin-panel/payment-methods/create']);
    }

    changePaymentMethodStatus() {
        console.log('Change status');
    }

    editPaymentMethod() {
        console.log('Edit Payment');
    }

    deletePaymentMethod() {
        console.log('Delete Payment');
    }
}
