import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
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
    styleUrls: ['./return-reason-create.component.scss'],
    animations: [routerTransition()],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReturnReasonCreateComponent implements OnInit {

    generalForm: FormGroup;
    public listMaster = {};
    constructor(public router: Router,
        private cd: ChangeDetectorRef,
        public route: ActivatedRoute,
        public fb: FormBuilder,
        public toastr: ToastrService,
        public keyService: ReturnReasonKeyService,
        private returnReasonService: ReturnReasonService) {
        this.generalForm = fb.group({
            'id': [null],
            'cd': [null, Validators.required],
            'des': [null, Validators.required],
            'exclude_rr_calc': [0],
            'sts': ['AT', Validators.required]
        });
        this.keyService.watchContext.next(this);
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (params.id) {
                this.getDetailReturnReason(params.id);
            } else {
                this.getGenerateCode();
            }
        });
        this.listMaster['status'] = [{ key: 'IA', value: 'In Active' }, { key: 'AT', value: 'Active' }];
    }

    refresh() {
        this.cd.detectChanges();
    }

    payloadData() {
        if (this.generalForm.get('id').value) {
            this.updateReturnReason(this.generalForm.get('id').value);
        } else {
            this.createReturnReason();
        }
    }
    getGenerateCode() {
        this.returnReasonService.getGenerateCode().subscribe(res => {
            this.generalForm.get('cd').patchValue (res.message);
            this.refresh();
        });
    }
    createReturnReason() {
        const params = this.generalForm.value;
        this.returnReasonService.createReturnReason(params).subscribe(res => {
            this.toastr.success(res.message);
            this.refresh();
            this.router.navigate(['/admin-panel/return-reason']);
        }, err => {
            console.log(err);
        });
    }
    getDetailReturnReason(id) {
        console.log(id);
        this.returnReasonService.getDetailReturnReason(id).subscribe(res => {
            this.generalForm.patchValue(res.data);
            this.refresh();
        }, err => {
            console.log(err.message);
        });
    }
    updateReturnReason(id) {
        console.log(id);
        const params = this.generalForm.value;
        this.returnReasonService.updateReturnReason(id, params).subscribe(res => {
            this.toastr.success(res.message);
            this.refresh();
            this.router.navigate(['/admin-panel/return-reason']);
        }, err => {
            this.toastr.error(err.message);
        });
    }

}
