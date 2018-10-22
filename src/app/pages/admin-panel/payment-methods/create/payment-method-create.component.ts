import { transition } from '@angular/animations';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { routerTransition } from '../../../../router.animations';

import { HotkeysService } from 'angular2-hotkeys';
import { PaymentMethodsService } from '../payment-method.service';
import { PaymentMethodCreateKeyService } from './key.create.control';

@Component({
    selector: 'app-payment-method-create',
    templateUrl: './payment-method-create.component.html',
    styleUrls: ['./payment-method-create.component.scss'],
    animations: [routerTransition()],
    providers: [PaymentMethodsService, PaymentMethodCreateKeyService],
    changeDetection: ChangeDetectionStrategy.OnPush
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
    private paymentMethodDetail = {};
    public paymentMethodId = null;
    public isClickedSave = false;
    public isClickedTestConnection = false;
    public isChangePassword = false;
    public messageTestConnection = '';
    public testConnectionResult = false;
    public paymentForm: FormGroup;

    constructor(
        private cd: ChangeDetectorRef,
        public router: Router,
        public route: ActivatedRoute,
        public fb: FormBuilder,
        public toastr: ToastrService,
        private _hotkeysService: HotkeysService,
        public keyService: PaymentMethodCreateKeyService,
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
            sandbox: [null, Validators.required],
            // username: [null, Validators.required],
            // password: [null, Validators.required]
        });
        this.keyService.watchContext.next({ context: this, service: this._hotkeysService });
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.paymentMethodId = params.id;
            if (this.paymentMethodId) {
                this.getListMaster(this.paymentMethodId);
                this.getPaymentMethodDetail();
            } else {
                this.getListMaster('');
            }
        });
    }
    /**
     * Internal Function
     */
    refresh() {
         if (!this.cd['destroyed']) { this.cd.detectChanges(); }
    }

    getListMaster(paymentMethodId) {
        this.paymentMethodService.getListMaster(paymentMethodId).subscribe(
            res => {
                try {
                    this.listMaster.paymentTypes = res.data['payment_type'];
                    this.listMaster.paymentProcessors = res.data['payment_processor_type'];
                    this.listMaster.transactionTypes = res.data['payment_transaction_type'];
                    this.refresh();
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
                    this.refresh();
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
        this.clearTestConnectionResult();
    }

    checkShowPasswordField() { // Check when user edit a payment method and change type from 'Manual' to 'Online' and vice versa
        if ( !this.paymentMethodId ||
            (this.paymentMethodId && this.paymentMethodDetail['type'].toString() === '1' && this.paymentForm.value.type === '2')) { // user change type from 'Manual' to 'Online'
            return true; // user change type from 'Manual' to 'Online'
        }
        return false;
    }

    clearTestConnectionResult() {
        this.isClickedTestConnection = false;
        this.messageTestConnection = '';
        this.testConnectionResult = false;
    }

    checkDuplicateDisplayName() {
        const params = {
            name: this.paymentForm.value.name,
            type: this.paymentForm.value.type
        };
        if (this.paymentMethodId) {
            params['ignore_id'] = this.paymentMethodId;
        }
        this.paymentMethodService.checkDupliateDisplayName(params).subscribe(
            res => {
                this.toastr.success('This name can be used!');
                this.refresh();
            },
            err => {
                console.log(err);
            }
        );
    }

    checkFormValidation() {
        if (this.paymentForm.controls.type.valid) {
            switch (this.paymentForm.value.type.toString()) {
                case '1': {
                    // Manual
                    return this.checkFormValidationForManualType();
                }
                case '2': {
                    // Online
                    return this.checkFormValidationForOnlineType();
                }
                default : return false;
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
            this.checkFormValidationForManualType() &&
            // this.paymentForm.controls.username.valid &&
            // this.paymentForm.controls.password.valid &&
            // this.checkPasswordIsValid() &&
            this.paymentForm.controls.service_id.valid &&
            this.paymentForm.controls.sandbox.valid &&
            this.paymentForm.controls.service_secret.valid &&
            (this.paymentForm.value.processor_type.toString() !== '3'
            || (this.paymentForm.value.processor_type.toString() === '3' && this.paymentForm.controls.transaction_type.valid))
        ) {
            return true;
        }
        return false;
    }

    checkPasswordIsValid() {
        // if ( (!this.paymentMethodId && this.paymentForm.controls.password.valid) // Create Payment Method
        //     || (this.paymentMethodId && this.paymentForm.controls.password.valid && this.isChangePassword) // Edit and change password
        //     || (this.paymentMethodId && this.paymentForm.controls.password.invalid && !this.isChangePassword) // Edit and do not change password
        //     || (this.checkShowPasswordField() && this.paymentForm.controls.password.valid)) { // edit and change type from 'Manual' to 'Online'
        //     return true;
        // }
        // return false;
    }

    testConnection() {
        this.isClickedTestConnection = true;
        const params = {
            processor_type: this.paymentForm.value.processor_type,
            sandbox: this.paymentForm.value.sandbox,
            service_id: this.paymentForm.value.service_id,
            service_secret: this.paymentForm.value.service_secret
        };
        this.paymentMethodService.testConnection(params).subscribe(
            res => {
                try {
                    this.toastr.success(res.message);
                    this.messageTestConnection = res.message;
                    this.testConnectionResult = true;
                    this.refresh();
                } catch (err) {
                    console.log(err);
                }
            },
            err => {
                console.log(err);
                this.messageTestConnection = err.message;
                this.testConnectionResult = false;
            }
        );
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
                this.refresh();
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
                this.refresh();
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
    reback() {
        this.router.navigate(['/admin-panel/payment-methods/']);
    }
}
