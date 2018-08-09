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

import { ConfirmModalContent } from '../../../../shared/modals/confirm.modal';

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
    public paymentMethods = [];
    public isCheckedAllPaymentMethod = false;

    constructor(
        public router: Router,
        public fb: FormBuilder,
        public toastr: ToastrService,
        public tableService: TableService,
        public keyService: PaymentMethodsKeyService,
        public ngbModal: NgbModal,
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

    checkAll(ev) {
        this.paymentMethods.forEach(paymentMethod => (paymentMethod.checked = ev.target.checked));
    }

    isAllChecked() {
        this.isCheckedAllPaymentMethod = this.paymentMethods.every(_ => _.checked);
    }

    /**
     * Internal Function
     */
    getListPaymentMethods() {
        const params = { ...this.tableService.getParams(), ...this.searchForm.value };
        Object.keys(params).forEach((key) => (params[key] === null || params[key] === '') && delete params[key]);
        this.paymentMethodService.getPaymentMethods(params).subscribe(
            res => {
                try {
                    this.paymentMethods = res.data.rows;
                    this.isAllChecked();
                    this.tableService.matchPagingOption(res.data);
                } catch (err) {
                    console.log(err);
                }
            },
            err => {
                console.log(err);
            }
        );
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

    changePaymentMethodStatus(payment) {
        payment.ac = payment.ac ? 1 : 0;
        const params = { ac: payment.ac, ...{ messages: 1 } };
        this.paymentMethodService.editPaymentMethod(payment.id, params).subscribe(
            res => {
                try {
                    this.toastr.success(res.message);
                } catch (err) {
                    console.log(err);
                    payment.ac = payment.ac ? 0 : 1;
                }
            },
            err => {
                console.log(err);
                payment.ac = payment.ac ? 0 : 1;
            });
    }

    changePaymentMethodStatusMulti() {
        const params = {
            payment_method_ids: this.paymentMethods.filter(_ => _.checked).map(_ => _.id),
            messages: 1
        };
        if (params.payment_method_ids.length) {
            this.paymentMethodService.changeStatusForMultiPaymentMethod(params).subscribe(
                res => {
                    try {
                        this.toastr.success(res.message);
                        this.getListPaymentMethods();
                    } catch (err) {
                        console.log(err);
                    }
                },
                err => {
                    console.log(err);
                }
            );
        } else {
            this.toastr.error('Please select at least 1 Payment Method to change status!');
        }
    }

    editPaymentMethod(paymentMethodId) {
        this.router.navigate(['/admin-panel/payment-methods/edit', paymentMethodId]);
    }

    deletePaymentMethod(payment) {
        const modalRef = this.ngbModal.open(ConfirmModalContent);
        modalRef.result.then(result => {
            if (result) {
                this.paymentMethodService.deletePaymentMethod(payment.id).subscribe(
                    res => {
                        try {
                            this.toastr.success(res.message);
                            this.getListPaymentMethods();
                        } catch (err) {
                            console.log(err);
                        }
                    },
                    err => {
                        console.log(err);
                    }
                );
            }
        });
    }
}
