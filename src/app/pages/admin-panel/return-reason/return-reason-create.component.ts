import { Component, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { routerTransition } from '../../../router.animations';
import { ReturnReasonKeyService} from './keys.control';
import { ReturnReasonService } from './return-reason.service';

@Component({
    selector: 'app-reason-create',
    templateUrl: './return-reason-create.component.html',
    providers: [ReturnReasonService, ReturnReasonKeyService],
    styleUrls: ['./reason.component.scss'],
    animations: [routerTransition()]
})
export class ReturnReasonCreateComponent implements OnInit {

    generalForm: FormGroup;
    public listMaster = {};
    constructor(public router: Router,
        public route: ActivatedRoute,
        public fb: FormBuilder,
        public toastr: ToastrService,
        private keyService: ReturnReasonKeyService,
        private returnReasonService: ReturnReasonService) {
        this.generalForm = fb.group({
            'id': [null],
            'cd': [null, Validators.required],
            'des': [null, Validators.required],
            'exclude_rr_calc': [null, Validators.required],
            'sts': ['AT', Validators.required]
        });
        this.keyService.watchContext.next(this);
    }

    ngOnInit() {
        this.listMaster['status'] = [{ key: 'IA', value: 'In Active' }, { key: 'AT', value: 'Active' }];
        this.route.params.subscribe(params => this.getDetailReturnReason(params.id));
    }
    payloadData() {
        if (this.generalForm.get('id').value) {
            this.updateReturnReason(this.generalForm.get('id').value);
        } else {
            this.createReturnReason();
        }
    }
    createReturnReason() {
        const params = this.generalForm.value;
        this.returnReasonService.createReturnReason(params).subscribe(res => {
            this.toastr.success(res.message);
            this.router.navigate(['/admin-panel/return-reason']);
        }, err => {
            console.log(err);
        });
    }
    getDetailReturnReason(id) {
        console.log(id);
        this.returnReasonService.getDetailReturnReason(id).subscribe(res => {
            this.generalForm.patchValue(res.data);
        }, err => {
            console.log(err.message);
        });
    }
    updateReturnReason(id) {
        console.log(id);
        const params = this.generalForm.value;
        this.returnReasonService.updateReturnReason(id, params).subscribe(res => {
            this.toastr.success(res.message);
        }, err => {
            this.toastr.error(err.message);
        });
    }

}
