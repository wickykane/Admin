import { Component, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';

import { ToastrService } from 'ngx-toastr';
import { routerTransition } from '../../../router.animations';
import { PayTermKeyService } from './keys.control';
import { PaymentTermService } from './payterm.service';

@Component({
    selector: 'app-payterm-create',
    templateUrl: './payterm-create.component.html',
    providers: [PaymentTermService, PayTermKeyService],
    styleUrls: ['./payterm.component.scss'],
    animations: [routerTransition()]
})
export class PayTermCreateComponent implements OnInit {

    generalForm: FormGroup;
    public isEdit = false;
    public listMaster = {};
    constructor(public router: Router,
        public route: ActivatedRoute,
        public fb: FormBuilder,
        public toastr: ToastrService,
        public keyService: PayTermKeyService,
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
        this.keyService.watchContext.next(this);
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

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (params.id) {
                this.getDetailPaymentTerm(params.id);
                this.isEdit = true;
                this.generalForm.get('early_pmt_incentive').disable();
            } else {
                this.getGenerateCode();
            }
        });
        this.listMaster['status'] = [{ key: 0, value: 'In Active' }, { key: 1, value: 'Active' }];
        this.listMaster['early'] = [{ key: 1, value: 'Percent' }, { key: 2, value: 'Fixed Amount' }];
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
        });
    }
    createPaymentTerm() {
        const params = this.generalForm.value;
        params.early_pmt_incentive = (params.early_pmt_incentive) ? 1 : 0;
        delete params.id;
        this.paytermService.createPayment(params).subscribe(res => {
            this.toastr.success(res.message);
            setTimeout(() => {
                this.router.navigate(['/admin-panel/payment-term']);
            }, 100);
        }, err => {
            console.log(err);
        });
    }
    getDetailPaymentTerm(id) {
        if (id) {
            this.paytermService.getDetailPayment(id).subscribe(res => {
                this.generalForm.patchValue(res.data);
            }, err => {
                console.log(err.message);
            });
        }
    }
    updatePaymentTerm(id) {
        const params = this.generalForm.value;
        params.early_pmt_incentive = (params.early_pmt_incentive) ? 1 : 0;
        this.paytermService.updatePayment(id, params).subscribe(res => {
            this.toastr.success(res.message);
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
