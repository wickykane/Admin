import { transition } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { routerTransition } from '../../../../router.animations';

import { PaymentMethodsService } from '../payment-method.service';

@Component({
    selector: 'app-payment-method-create',
    templateUrl: './payment-method-create.component.html',
    styleUrls: ['./payment-method-create.component.scss'],
    animations: [routerTransition()],
    providers: [PaymentMethodsService]
})
export class PaymentMethodsCreateComponent implements OnInit {
    /**
     * letiable Declaration
     */
    public listMaster = {
        paymentTypes: [],
        paymentProcessors: [],
        transactionTypes: [],
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
    public isClickedSave = false;
    // public isDuplicateDisplayName = false;
    public paymentForm: FormGroup;

    constructor(
        public router: Router,
        public fb: FormBuilder,
        public toastr: ToastrService,
        public paymentMethodService: PaymentMethodsService
    ) {
        this.paymentForm = fb.group({
            type: [null, Validators.required],
            processor_type: [null, Validators.required],
            name: [null, Validators.required],
            ac: [null, Validators.required],
            show_in_store: [null, Validators.required],
            desc: [null, Validators.required],
            transition_type: [null, Validators.required],
            service_id: [null, Validators.required],
            service_secret: [null, Validators.required],
            sandbox: [null]
        });
    }

    ngOnInit() {
        this.getPaymentTypes();
        this.getPaymentProcessors();
        this.getTransactionTypes();
    }
    /**
     * Internal Function
     */

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

    getPaymentProcessors() {
        this.paymentMethodService.getPaymentProcessors().subscribe(
            res => {
                try {
                    this.listMaster.paymentProcessors = res.data;
                } catch (err) {
                    console.log(err);
                }
            },
            err => {
                console.log(err);
            }
        );
    }

    getTransactionTypes() {
        this.paymentMethodService.getPaymentTransactionTypes().subscribe(
            res => {
                try {
                    this.listMaster.transactionTypes = res.data;
                } catch (err) {
                    console.log(err);
                }
            },
            err => {
                console.log(err);
            }
        );
    }

    clearFieldWhenChangeType(selectedType) {
        this.isClickedSave = false;
        this.paymentForm.reset();
        this.paymentForm.patchValue({ type: selectedType });
        this.paymentForm.patchValue({ show_in_store: 1 });
        if (selectedType === '2') { this.paymentForm.patchValue({ sandbox: 1 }); }
    }

    checkDuplicateDisplayName() {
        const params = {
            name: this.paymentForm.value.name,
            type: this.paymentForm.value.type
        };
        this.paymentMethodService.checkDupliateDisplayName(params).subscribe(
            res => {
                try {
                    // this.isDuplicateDisplayName = false;
                } catch (err) {
                    console.log(err);
                }
            },
            err => {
                // this.isDuplicateDisplayName = true;
                console.log(err);
            }
        );
    }

    checkFormValidation() {
        switch (this.paymentForm.value.type) {
            case '1': {
                // Manual
                return this.checkFormValidationForManualType();
            }
            case '2': {
                // Online
                return this.checkFormValidationForOnlineType();
            }
        }
        return false;
    }

    checkFormValidationForManualType() {
        if (
            this.paymentForm.controls.name.valid &&
            this.paymentForm.controls.ac.valid &&
            this.paymentForm.controls.show_in_store.valid &&
            this.paymentForm.controls.desc.valid
        ) {
            return true;
        }
        return false;
    }

    checkFormValidationForOnlineType() {
        if (
            this.paymentForm.value.processor_type &&
            this.paymentForm.controls.name.valid &&
            this.paymentForm.controls.ac.valid &&
            this.paymentForm.controls.service_id.valid &&
            this.paymentForm.controls.sandbox.valid &&
            this.paymentForm.controls.show_in_store.valid &&
            this.paymentForm.controls.service_secret.valid &&
            this.paymentForm.controls.transition_type.valid &&
            this.paymentForm.controls.desc.valid
        ) {
            return true;
        }
        return false;
    }

    savePaymentMethod() {
        this.isClickedSave = true;
        if (this.checkFormValidation()) {
            const params = { ...this.paymentForm.value, ...{ messages: 1 } };
            Object.keys(params).forEach(
                key =>
                    (params[key] === null || params[key] === '') &&
                    delete params[key]
            );
            this.paymentMethodService.createPaymentMethod(params).subscribe(
                res => {
                    try {
                        this.isClickedSave = false;
                        this.toastr.success(res.message);
                        setTimeout(() => {
                            window.history.back();
                        }, 500);
                    } catch (err) {
                        console.log(err);
                    }
                },
                err => {
                    console.log(err);
                }
            );
        }
    }
}
