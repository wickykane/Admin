import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';

import { HotkeysService } from 'angular2-hotkeys';
import { ToastrService } from 'ngx-toastr';
import { routerTransition } from '../../../router.animations';
import { PaymentTermCreateKeyService } from './create-keys.controls';
import { PaymentTermService } from './payterm.service';

@Component({
    selector: 'app-payterm-create',
    templateUrl: './payterm-create.component.html',
    providers: [PaymentTermService, PaymentTermCreateKeyService],
    styleUrls: ['./payterm-create.component.scss'],
    animations: [routerTransition()],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PayTermCreateComponent implements OnInit {
    public checkDes = false;
    generalForm: FormGroup;
    public isEdit = false;
    public listMaster = {};
    constructor(public router: Router,
        private cd: ChangeDetectorRef,
        public route: ActivatedRoute,
        public fb: FormBuilder,
        public toastr: ToastrService,
        public keyService: PaymentTermCreateKeyService,
        private _hotkeysService: HotkeysService,
        private paytermService: PaymentTermService) {
        this.generalForm = fb.group({
            'id': [null],
            'cd': [null, Validators.required],
            'des': [null, Validators.required],
            'early_pmt_incentive': [0],
            'dsct_day': [null],
            'dsct_value': [null],
            'dsct_type': [1],
            'term_day': [null, Validators.required],
            'ac': [0, Validators.required]
        });
        this.keyService.watchContext.next({ context: this, service: this._hotkeysService });
    }

    ngOnInit() {
        console.log(this.checkDes);
        this.route.params.subscribe(params => {
            if (params.id) {
                this.getDetailPaymentTerm(params.id);
                this.isEdit = true;
                this.generalForm.get('early_pmt_incentive').disable();
                this.refresh();
            } else {
                this.getGenerateCode();
            }
        });
        this.listMaster['status'] = [{ key: 0, value: 'In Active' }, { key: 1, value: 'Active' }];
        this.listMaster['early'] = [{ key: 1, value: 'Percent' }, { key: 2, value: 'Fixed Amount' }];
        this.changeIncentive();
    }
    refresh() {
        if (!this.cd['destroyed']) { this.cd.detectChanges(); }
    }
    payloadData() {
        if (this.generalForm.get('id').value) {
            this.updatePaymentTerm(this.generalForm.get('id').value);
        } else {
            this.createPaymentTerm();
        }
    }
    getGenerateCode() {
        this.paytermService.getGenerateCode().subscribe(res => {
            this.generalForm.get('cd').patchValue(res.message);
            this.refresh();
        });
    }
    createPaymentTerm() {
        const params = this.generalForm.value;
        if (!+params.dsct_value && params.early_pmt_incentive) {
            this.toastr.error('Discount Value must greater than 0.');
            return;
        }
        params.early_pmt_incentive = (params.early_pmt_incentive) ? 1 : 0;
        delete params.id;
        this.paytermService.createPayment(params).subscribe(res => {
            this.toastr.success(res.message);
            this.refresh();
            setTimeout(() => {
                this.router.navigate(['/admin-panel/payment-term']);
            }, 100);
        }, err => {
            if (err.message === 'Cannot input special character.') {
                this.checkDes = true;
                this.ngOnInit();
            }
            console.log(err);
        });
    }
    changeIncentive(e?) {
        if (e) {
            if (e.target.checked) {
                this.generalForm.get('dsct_day').setValidators(Validators.required);
                this.generalForm.get('dsct_value').setValidators(Validators.required);
                this.generalForm.get('dsct_type').setValidators(Validators.required);
            } else {
                this.generalForm.get('dsct_day').clearValidators();
                this.generalForm.get('dsct_value').clearValidators();
                this.generalForm.get('dsct_type').clearValidators();
            }

        } else {
            this.generalForm.get('early_pmt_incentive').valueChanges.map(
                value => {
                    if (value) {
                        this.generalForm.get('dsct_day').setValidators(Validators.required);
                        this.generalForm.get('dsct_value').setValidators(Validators.required);
                        this.generalForm.get('dsct_type').setValidators(Validators.required);
                    } else {
                        this.generalForm.get('dsct_day').clearValidators();
                        this.generalForm.get('dsct_value').clearValidators();
                        this.generalForm.get('dsct_type').clearValidators();
                    }
                }
            );
        }
        this.refresh();
    }

    getDetailPaymentTerm(id) {
        if (id) {
            this.paytermService.getDetailPayment(id).subscribe(res => {
                this.generalForm.patchValue(res.data);
                this.changeIncentive();
                this.refresh();
            }, err => {
                console.log(err.message);
            });
        }
    }
    updatePaymentTerm(id) {
        const params = this.generalForm.value;
        if (!+params.dsct_value && params.early_pmt_incentive) {
            this.toastr.error('Discount Value must greater than 0.');
            return;
        }
        params.early_pmt_incentive = (params.early_pmt_incentive) ? 1 : 0;
        this.paytermService.updatePayment(id, params).subscribe(res => {
            this.toastr.success(res.message);
            this.refresh();
            this.router.navigate(['/admin-panel/payment-term']);
        }, err => {
            this.toastr.error(err.message);
        });
    }
    numberMaskObject(max?) {
        return createNumberMask({
            allowDecimal: false,
            includeThousandsSeparator: false,
            prefix: '',
            integerLimit: max || null
        });
    }
    numberMaskObjectDecimal(max?) {
        return createNumberMask({
            allowDecimal: true,
            includeThousandsSeparator: false,
            prefix: '',
            integerLimit: max || null
        });
    }

}
