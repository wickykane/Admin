import { Component, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { routerTransition } from '../../../router.animations';
import { ReturnReasonService } from './return-reason.service';

@Component({
    selector: 'app-reason-create',
    templateUrl: './return-reason-create.component.html',
    providers: [ReturnReasonService],
    styleUrls: ['./reason.component.scss'],
    animations: [routerTransition()]
})
export class PayTermCreateComponent implements OnInit {

    generalForm: FormGroup;
    public listMaster = {};
    constructor(public router: Router,
        public route: ActivatedRoute,
        public fb: FormBuilder,
        public toastr: ToastrService,
        private returnReasonService: ReturnReasonService) {
        this.generalForm = fb.group({
            'id': [null],
            'cd': [null, Validators.required],
            'des': [null, Validators.required],
            'day_limit': [null, Validators.required],
            'sts': ['AT', Validators.required]
        });
    }

    ngOnInit() {
        this.listMaster['status'] = [{ key: 'IA', value: 'In Active' }, { key: 'IA', value: 'In Active' }];
        this.route.params.subscribe(params => this.getDetailPaymentTerm(params.id));
    }
    payloadData() {
        if (this.generalForm.get('id').value) {
            this.updatePaymentTerm(this.generalForm.get('id').value);
        } else {
            this.createPaymentTerm();
        }
    }
    createPaymentTerm() {
        const params = this.generalForm.value;
        this.returnReasonService.createReturnReason(params).subscribe(res => {
            this.toastr.success(res.message);
            this.router.navigate(['/admin-panel/payment-term']);
        }, err => {
            console.log(err);
        });
    }
    getDetailPaymentTerm(id) {
        console.log(id);
        this.returnReasonService.getDetailReturnReason(id).subscribe(res => {
            this.generalForm.patchValue(res.data);
        }, err => {
            console.log(err.message);
        });
    }
    updatePaymentTerm(id) {
        console.log(id);
        const params = this.generalForm.value;
        this.returnReasonService.updateReturnReason(id, params).subscribe(res => {
            this.toastr.success(res.message);
        }, err => {
            this.toastr.error(err.message);
        });
    }

}
