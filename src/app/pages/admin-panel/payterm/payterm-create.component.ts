import { Component, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { routerTransition } from '../../../router.animations';
import { PaymentTermService } from './payterm.service';

@Component({
    selector: 'app-payterm-create',
    templateUrl: './payterm-create.component.html',
    providers: [PaymentTermService],
    styleUrls: ['./payterm.component.scss'],
    animations: [routerTransition()]
})
export class PayTermCreateComponent implements OnInit {

    generalForm: FormGroup;
    public listMaster = {};
    constructor(public router: Router,
        public fb: FormBuilder,
        public toastr: ToastrService,
        private paytermService: PaymentTermService) {
            this.generalForm = fb.group({
                    'cd': [null, Validators.required],
                    'des': [null, Validators.required],
                    'day_limit': [null, Validators.required],
                    'sts': ['AT', Validators.required]
            });
    }

    ngOnInit() {
        this.listMaster['status'] = [{key: 'IA', value: 'In Active'}, {key: 'IA', value: 'In Active'}];
    }
    createPaymentTerm() {
        const params = this.generalForm.value;
        this.paytermService.createPayment(params).subscribe(res => {
            console.log(res);
            this.toastr.success(res.message);
            this.router.navigate(['/admin-panel/payment-term']);
        }, err => {
            console.log(err);
        })
    }
}
