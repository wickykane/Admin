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
    public listMaster = {};
    constructor(public router: Router,
        public route: ActivatedRoute,
        public fb: FormBuilder,
        public toastr: ToastrService,
        public keyService: PayTermKeyService,
        private paytermService: PaymentTermService) {
        this.generalForm = fb.group({
            'id': [null],
            'cd': [{ value: null, disabled: true }, Validators.required],
            'des': [null, Validators.required],
            'day_limit': [null, Validators.required],
            'sts': ['AT', Validators.required]
        });
        this.keyService.watchContext.next(this);
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (params.id) {
                this.getDetailPaymentTerm(params.id);
            } else {
                this.getGenerateCode();
            }
        });
        this.listMaster['status'] = [{ key: 'IA', value: 'In Active' }, { key: 'AT', value: 'Active' }];
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
            this.generalForm.get('cd').patchValue (res.message);
        });
    }
    createPaymentTerm() {
        const params = this.generalForm.value;
        this.paytermService.createPayment(params).subscribe(res => {
            this.toastr.success(res.message);
            this.router.navigate(['/admin-panel/payment-term']);
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
        this.paytermService.updatePayment(id, params).subscribe(res => {
            this.toastr.success(res.message);
        }, err => {
            this.toastr.error(err.message);
        });
    }
    numberMaskObject(max?) {
        return createNumberMask({
            allowDecimal: false,
            includeThousandsSeparator : false,
            prefix: '',
            integerLimit: max || null
        });
    }

}
