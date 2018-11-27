import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HotkeysService } from 'angular2-hotkeys';
import { ToastrService } from 'ngx-toastr';
import { routerTransition } from '../../../router.animations';
import { ReturnPolicyService } from './return-policy.service';

@Component({
    selector: 'app-return-policy',
    templateUrl: './return-policy.component.html',
    styleUrls: ['./return-policy.component.scss'],
    animations: [routerTransition()],
    providers: [ReturnPolicyService],
})
export class ReturnPolicyComponent implements OnInit {
    public policySetupForm: FormGroup;
    constructor(
        private fb: FormBuilder,
        private cd: ChangeDetectorRef,
        public toastr: ToastrService,
        private returnPolicy: ReturnPolicyService,
    ) {
        this.policySetupForm = fb.group({
            ac: [0],
            base_on: [null],
            value: [null, Validators.required ],
            id: [null],
        });
    }
    ngOnInit() {
        this.onGetPolicy();
    }
    refresh() {
        if (!this.cd['destroyed']) { this.cd.detectChanges(); }
    }
    // onChange() {
    //    this.onSavePolicy();
    // }
    onGetPolicy() {
        this.returnPolicy.getReturnPolicy().subscribe(res => {
            this.policySetupForm.patchValue(res.data);
        }, err => {console.log(err); });
    }
    onSavePolicy() {
        this.policySetupForm.value.ac = this.policySetupForm.value.ac ? 1 : 0 ;
        const params = this.policySetupForm.value;
        this.returnPolicy.saveReturnPolicy(params).subscribe(res => {
            try {
                this.toastr.success(res.message);
                this.refresh();
            }  catch (e) {
                this.toastr.error(e);
            }
        }, err => {console.log(err); });
    }
}
