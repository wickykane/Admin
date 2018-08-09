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
    public paymentMethodId = null;
    private paymentMethodDetail = {};
    public isClickedSave = false;
    public paymentForm: FormGroup;

    constructor(
        public router: Router,
        public route: ActivatedRoute,
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
            transaction_type: [null, Validators.required],
            service_id: [null, Validators.required],
            service_secret: [null, Validators.required],
            sandbox: [null]
        });
    }

    ngOnInit() {
        this.getPaymentTypes();
        this.getPaymentProcessors();
        this.getTransactionTypes();
        this.route.params.subscribe(params => {
            this.paymentMethodId = params.id;
            if (this.paymentMethodId) { this.getPaymentMethodDetail(); }
        });
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

    getPaymentMethodDetail() {
        this.paymentMethodService.getPaymentMethodDetail(this.paymentMethodId).subscribe(
            res => {
                try {
                    this.paymentMethodDetail = res.data;
                    this.paymentForm.patchValue({ ...res.data, ...res.data.online_configuration });
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
        if (this.paymentMethodId === null || this.paymentMethodId === undefined) {
            this.paymentForm.patchValue({ show_in_store: 1 });
            if (selectedType.toString() === '2') { this.paymentForm.patchValue({ sandbox: 1 }); }
        } else {
            if (selectedType.toString() === '2') {
                this.paymentForm.patchValue({ ...this.paymentMethodDetail, ...this.paymentMethodDetail['online_configuration'] });
                if (this.paymentForm.value.sandbox === null || this.paymentForm.value.sandbox === undefined) {
                    this.paymentForm.patchValue({ sandbox: 1 });
                }
            } else {
                this.paymentForm.patchValue({ ...this.paymentMethodDetail });
            }
        }
        this.paymentForm.patchValue({ type: selectedType });
    }

    checkDuplicateDisplayName() {
        const params = {
            name: this.paymentForm.value.name,
            type: this.paymentForm.value.type
        };
        this.paymentMethodService.checkDupliateDisplayName(params).subscribe(
            res => {},
            err => {
                console.log(err);
            }
        );
    }

    checkFormValidation() {
        switch (this.paymentForm.value.type.toString()) {
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
            this.paymentForm.controls.processor_type.valid &&
            this.paymentForm.controls.name.valid &&
            this.paymentForm.controls.ac.valid &&
            this.paymentForm.controls.service_id.valid &&
            this.paymentForm.controls.sandbox.valid &&
            this.paymentForm.controls.show_in_store.valid &&
            this.paymentForm.controls.service_secret.valid &&
            this.paymentForm.controls.transaction_type.valid &&
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
            Object.keys(params).forEach(key => (params[key] === null || params[key] === '') && delete params[key]);
            this.paymentMethodId !== null && this.paymentMethodId !== undefined ? this.doEditPaymentMethod(params) : this.doCreatePaymentMethod(params);
        }
    }

    doCreatePaymentMethod(params) {
        this.paymentMethodService.createPaymentMethod(params).subscribe(
            res => {
                this.handleSavePaymentMethodSuccessfully(res);
            },
            err => {
                console.log(err);
            }
        );
    }

    doEditPaymentMethod(params) {
        this.paymentMethodService.editPaymentMethod(this.paymentMethodId, params).subscribe(
            res => {
                this.handleSavePaymentMethodSuccessfully(res);
            },
            err => {
                console.log(err);
            }
        );
    }

    handleSavePaymentMethodSuccessfully(res) {
        try {
            this.isClickedSave = false;
            this.toastr.success(res.message);
            setTimeout(() => {
                window.history.back();
            }, 500);
        } catch (err) {
            console.log(err);
        }
    }
}
