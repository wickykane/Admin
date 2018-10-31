import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';

import { ToastrService } from 'ngx-toastr';
import { routerTransition } from '../../../router.animations';
import { LateFeePolicyDetailKeyService } from './keys.detail.control';
import { LateFeePolicyService } from './late-fee-policy.service';
import { CustomerModalContent } from './modal/customer.modal';
import { TerminatePolicyModalContent } from './modal/terminate-policy.modal';

@Component({
    selector: 'app-late-fee-policy-detail',
    templateUrl: './late-fee-policy-detail.component.html',
    providers: [LateFeePolicyService, LateFeePolicyDetailKeyService],
    styleUrls: ['./late-fee-policy-detail.component.scss'],
    animations: [routerTransition()],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LateFeePolicyDetailComponent implements OnInit {

    generalForm: FormGroup;
    public listMaster = {};
    public list = {
        items: [],
        checklist: []
    };
    public checkAllItem;
    public headerTitle;
    public currentStatus;
    public applyRecurringFee = false;
    public isCreate = false;
    public isView = false;
    public isEdit = false;

    constructor(public router: Router,
        private cd: ChangeDetectorRef,
        public route: ActivatedRoute,
        public fb: FormBuilder,
        public toastr: ToastrService,
        private modalService: NgbModal,
        public keyService: LateFeePolicyDetailKeyService,
        private lateFeePolicyService: LateFeePolicyService) {
        this.generalForm = fb.group({
            'id': [null],
            'code': [null, Validators.required],
            'des': [null, Validators.required],
            'apply_for': [null, Validators.required],
            'ac': [null, Validators.required],
            'recuring_fee': [null],
            'recuring_fee_status': [false],
            'pay_type': [null],
            'pay_value': [null],
            'late_due_dt': [null],
            'company': [null],
        });
        this.keyService.watchContext.next(this);
    }

    ngOnInit() {
        const path = window.location.pathname;
        this.route.params.subscribe(params => {
            if (params.id) {
                this.isCreate = false;
                if (path.indexOf('edit') !== -1) {
                    this.isView = false;
                    this.isEdit = true;
                }
                if (path.indexOf('view') !== -1) {
                    this.isView = true;
                    this.isEdit = false;
                }
                this.listMaster['status'] = [
                    { id: 1, value: 'Active' },
                    { id: 0, value: 'Inactive' },
                    { id: 2, value: 'Closed' }
                ];
                this.getDetailLateFeePolicy(params.id);
            } else {
                this.isView = false;
                this.isEdit = false;
                if (path.indexOf('create') !== -1) {
                    this.isCreate = true;
                    this.headerTitle = 'CREATE NEW POLICY';
                }
                this.listMaster['status'] = [
                    { id: 1, value: 'Active' },
                    { id: 0, value: 'Inactive' }
                ];
                this.getGenerateCode();
            }
        });
        this.listMaster['applyFor'] = [
            { id: 1, value: 'All Customers' },
            { id: 2, value: 'Specific Customers' }
        ];
        this.listMaster['payType'] = [
            { id: 1, value: 'Percent' },
            { id: 2, value: 'Fixed Amount' }
        ];
        this.listMaster['buyerType'] = [
            { code: 'CP', name: 'Company' },
            { code: 'PS', name: 'Personal' }
        ];
        // this.initLateFeeRules();
    }

    refresh() {
         if (!this.cd['destroyed']) { this.cd.detectChanges(); }
    }

    checkAll(ev) {
        this.list.items.forEach(x => (x.is_checked = ev.target.checked));
        this.list.checklist = this.list.items.filter(_ => _.is_checked);
    }

    isAllChecked() {
        this.checkAllItem = this.list.items.every(_ => _.is_checked);
        this.list.checklist = this.list.items.filter(_ => _.is_checked);
    }

    deleteAction(id) {
        this.list.items = this.list.items.filter((item) => {
            return item.id !== id;
        });
    }

    removeSelectedCustomers() {
        const listAdded = [];
        (this.list.checklist).forEach((item) => {
            listAdded.push(item.id);
        });
        this.list.items = this.list.items.filter((item) => {
            return listAdded.indexOf(item.id) < 0;
        });
        this.list.checklist = [];
    }

    getListCustomerType() {
        this.lateFeePolicyService.getListCustomerType().subscribe(res => {
            try {
                this.listMaster['buyerType'] = res.data;
                this.refresh();
            } catch (e) {
                console.log(e);
            }
        });
    }

    // initLateFeeRules() {
    //     if (this.generalForm.value['recuring_fee_status'] === false) {
    //         this.generalForm.controls['recuring_fee'].disable();
    //         this.generalForm.controls['pay_value'].disable();
    //         this.generalForm.controls['pay_type'].disable();
    //         this.generalForm.controls['late_due_dt'].disable();
    //     } else {
    //         this.generalForm.controls['recuring_fee'].enable();
    //         this.generalForm.controls['pay_value'].enable();
    //         this.generalForm.controls['pay_type'].enable();
    //         this.generalForm.controls['late_due_dt'].enable();
    //     }
    // }

    switchRule(event) {
        this.generalForm.controls['recuring_fee_status'].setValue(!this.generalForm.value['recuring_fee_status']);
        this.applyRecurringFee = !this.applyRecurringFee;
        // this.initLateFeeRules();
    }

    payloadData() {
        if (this.generalForm.get('recuring_fee').value == '0' && this.applyRecurringFee === true) {
            return this.toastr.error('Recurring fee must be greater than 0');
        }
        if (this.generalForm.get('id').value && this.isEdit) {
            if (this.currentStatus !== 2 && this.generalForm.value['ac'] === 2) {
                this.openTerminateLFPModal();
            } else {
                this.updateLateFeePolicy(this.generalForm.get('id').value);
            }
        } else {
            this.createLateFeePolicy();
        }
    }

    getGenerateCode() {
        this.lateFeePolicyService.getGenerateCode().subscribe(res => {
            this.generalForm.controls['code'].setValue(res.data.code);
            this.listMaster['generate-code'] = res.data.code;
            this.refresh();
        });
    }

    openTerminateLFPModal() {
        const modalRef = this.modalService.open(TerminatePolicyModalContent);
        modalRef.result.then(result => {
            if (result) {
                this.updateLateFeePolicy(this.generalForm.get('id').value);
            }
        }, dismiss => {

        });
    }

    isValidLateFeePolicy() {
        if (this.generalForm.value['recuring_fee_status']) {
            if (!this.generalForm.value['recuring_fee'] || !this.generalForm.value['pay_value']
                || !this.generalForm.value['pay_type'] || !this.generalForm.value['late_due_dt']) {
                return false;
            }
        }
        if (this.generalForm.value['apply_for'] === 2 && this.list.items.length === 0) {
            return false;
        }
        return true;
    }

    createLateFeePolicy() {
        const params = this.generalForm.value;
        params['recuring_fee_status'] = this.generalForm.value['recuring_fee_status'] ? 1 : 0;
        const listCustomer = [];
        (this.list.items).forEach((item) => {
            listCustomer.push(item.id);
        });
        params['company'] = listCustomer;
        this.lateFeePolicyService.createLateFeePolicy(params).subscribe(res => {
            this.toastr.success(res.message);
            this.refresh();
            this.router.navigate(['/admin-panel/late-fee-policy']);
        }, err => {
            console.log(err);
        });
    }

    updateLateFeePolicy(id) {
        const params = this.generalForm.value;
        params['recuring_fee_status'] = this.generalForm.value['recuring_fee_status'] ? 1 : 0;
        const listCustomer = [];
        (this.list.items).forEach((item) => {
            listCustomer.push(item.id);
        });
        params['company'] = listCustomer;
        this.lateFeePolicyService.updateLateFeePolicy(id, params).subscribe(res => {
            this.toastr.success(res.message);
            this.refresh();
            this.router.navigate(['/admin-panel/late-fee-policy']);
        }, err => {
            console.log(err);
        });
    }

    getDetailLateFeePolicy(id) {
        if (id) {
            this.lateFeePolicyService.getDetailLateFeePolicy(id).subscribe(res => {
                if (res.data.invoice_lfp) {
                    this.generalForm.patchValue(res.data.invoice_lfp);
                    this.currentStatus = res.data.invoice_lfp.ac;
                    if (res.data.invoice_lfp.recuring_fee_status === 1) {
                        this.generalForm.controls['recuring_fee_status'].setValue(true);
                        this.applyRecurringFee = true;
                    } else {
                        this.generalForm.controls['recuring_fee_status'].setValue(false);
                        this.applyRecurringFee = false;
                    }
                    this.headerTitle = this.generalForm.value['code'] + ': ' + this.generalForm.value['des'];
                    // this.initLateFeeRules();
                }
                if (res.data.detail) {
                    this.list.items = res.data.detail;
                }
                this.refresh();
            }, err => {
                console.log(err.message);
            });
        }
    }

    editLateFeePolicy(id?) {
        if (id) {
            this.router.navigate(['/admin-panel/late-fee-policy/edit', id]);
        } else {
            const policyId = this.generalForm.value['id'];
            const policyStatus = this.generalForm.value['ac'];
            if (policyId && policyStatus !== 2) {
                this.router.navigate(['/admin-panel/late-fee-policy/edit', policyId]);
            }
        }
    }

    backToList() {
        this.router.navigate(['/admin-panel/late-fee-policy']);
    }

    addNewCustomer() {
        const modalRef = this.modalService.open(CustomerModalContent, { size: 'lg' });
        modalRef.result.then(res => {
            if (res instanceof Array && res.length > 0) {
                const listAdded = [];
                (this.list.items).forEach((item) => {
                    listAdded.push(item.id);
                });

                res.forEach((item) => {
                    if (item.is_checked) { item.is_checked = false; }
                });

                this.list.items = this.list.items.concat(res.filter((item) => {
                    return listAdded.indexOf(item.id) < 0;
                }));
                this.refresh();
            }
        }, dismiss => { });
    }

    convertCustomerType(code) {
        const type = this.listMaster['buyerType'].find(item => item.code === code);
        return type.name;
    }

    convertStatus(id, key) {
        const stt = this.listMaster[key].find(item => item.id === id);
        return stt.value;
    }

    integerMaskObject(max?) {
        return createNumberMask({
            allowDecimal: false,
            includeThousandsSeparator: false,
            prefix: '',
            integerLimit: max || null,
        });
    }

    decimalMaskObject(max?) {
        return createNumberMask({
            allowDecimal: true,
            includeThousandsSeparator: false,
            prefix: '',
            integerLimit: max || null
        });
    }
}
