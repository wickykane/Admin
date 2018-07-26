import { Component, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';

import { ToastrService } from 'ngx-toastr';
import { routerTransition } from '../../../router.animations';
import { EPIPolicyService } from './epi-policy.service';
import { EPIPolicyListKeyService } from './keys.list.control';
import { CustomerEPIModalContent } from './modal/customer.modal';
import { TerminateEPIPolicyModalContent } from './modal/terminate-policy.modal';

@Component({
    selector: 'app-epi-policy-detail',
    templateUrl: './epi-policy-detail.component.html',
    providers: [EPIPolicyService, EPIPolicyListKeyService],
    styleUrls: ['./epi-policy.component.scss'],
    animations: [routerTransition()]
})
export class EPIPolicyDetailComponent implements OnInit {

    generalForm: FormGroup;
    public listMaster = {};
    public list = {
        items: [],
        checklist: []
    };
    public listAddedPaymentTermId = [];
    public listPaymentTerm = [];
    public checkAllItem;
    public headerTitle;
    public currentStatus;
    public isCreate = false;
    public isView = false;
    public isEdit = false;

    constructor(public router: Router,
        public route: ActivatedRoute,
        public fb: FormBuilder,
        public toastr: ToastrService,
        private modalService: NgbModal,
        public keyService: EPIPolicyListKeyService,
        private epiPolicyService: EPIPolicyService) {
        this.generalForm = fb.group({
            'id': [null],
            'code': [null, Validators.required],
            'des': [null, Validators.required],
            'apply_for': [null, Validators.required],
            'ac': [null, Validators.required],
            'payment_term': [null],
            'company': [null]
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
                this.getDetailEPIPolicy(params.id);
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
        this.getListPaymentTerm();
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

    deleteRule(index, subIndex) {
        this.listPaymentTerm[index].detail.splice(subIndex, 1);
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
        this.epiPolicyService.getListCustomerType().subscribe(res => {
            try {
                this.listMaster['buyerType'] = res.data;
            } catch (e) {
                console.log(e);
            }
        });
    }

    getListPaymentTerm() {
        this.epiPolicyService.getListPaymentTerm().subscribe(res => {
            try {
                this.listMaster['payment_terms'] = res.data.rows;
                if (this.isCreate) {
                    this.appendListPaymentTerm();
                }
            } catch (e) {
                console.log(e);
            }
        });
    }

    appendListPaymentTerm() {
        const listPaymentTerms = this.listMaster['payment_terms'];
        for (const unit of listPaymentTerms) {
            if (unit.id) {
                const tempPayment = {
                    payment_term_id: unit.id,
                    cd: unit.cd,
                    detail: []
                };
                this.listPaymentTerm.push(tempPayment);
            }
        }
    }

    transformListPaymentTerm(paymentTerm) {
        // for (const key in paymentTerm) {
        //     if (key) {
        //         console.log(paymentTerm[key]);
        //         const tempPayment = {
        //             payment_term_id: paymentTerm[key].payment_term_id,
        //             cd: paymentTerm[key].cd,
        //             detail: []
        //         };
        //         for (const subKey in paymentTerm[key]) {
        //             if (subKey && subKey !== 'payment_term_id') {
        //                 const tempItem = {
        //                     pay_type: paymentTerm[key][subKey].pay_type,
        //                     pay_value: paymentTerm[key][subKey].pay_value,
        //                     before_due_dt: paymentTerm[key][subKey].before_due_dt
        //                 };
        //                 tempPayment.detail.push(tempItem);
        //             }
        //         }
        //         this.listPaymentTerm.push(tempPayment);
        //     }
        // }
        for (const item of paymentTerm) {
            const tempPayment = {
                payment_term_id: item.payment_term.payment_term_id,
                cd: item.payment_term.cd,
                detail: item.payment_detail
            };
            this.listPaymentTerm.push(tempPayment);
        }
        console.log(this.listPaymentTerm);
    }

    payloadData() {
        if (this.generalForm.get('id').value && this.isEdit) {
            if (this.currentStatus !== 2 && this.generalForm.value['ac'] === 2) {
                this.openTerminateEPIPolicyModal();
            } else {
                this.updateEPIPolicy(this.generalForm.get('id').value);
            }
        } else {
            this.createEPIPolicy();
        }
    }

    getGenerateCode() {
        this.epiPolicyService.getGenerateCode().subscribe(res => {
            this.generalForm.controls['code'].setValue(res.data.code);
            this.listMaster['generate-code'] = res.data.code;
        });
    }

    openTerminateEPIPolicyModal() {
        const modalRef = this.modalService.open(TerminateEPIPolicyModalContent);
        modalRef.result.then(result => {
            if (result) {
                this.updateEPIPolicy(this.generalForm.get('id').value);
            }
        }, dismiss => {

        });
    }

    isValidEPIPolicy() {
        const listPaymentTerms = this.listPaymentTerm;
        for (const unit of listPaymentTerms) {
            if (unit.payment_term_id && unit.detail.length > 0) {
                for (const item of unit.detail) {
                    if (!item.pay_type || !item.pay_value || !item.before_due_dt) {
                        return false;
                    }
                }
            }
        }
        if (this.generalForm.value['apply_for'] === 2 && this.list.items.length === 0) {
            return false;
        }
        return true;
    }

    createEPIPolicy() {
        const params = this.generalForm.value;
        const listCustomer = [];
        (this.list.items).forEach((item) => {
            listCustomer.push(item.id);
        });
        params['company'] = listCustomer;
        params['payment_term'] = this.listPaymentTerm;
        console.log(params);
        this.epiPolicyService.createEPIPolicy(params).subscribe(res => {
            this.toastr.success(res.message);
            this.router.navigate(['/admin-panel/epi-policy']);
        }, err => {
            console.log(err);
        });
    }

    updateEPIPolicy(id) {
        const params = this.generalForm.value;
        const listCustomer = [];
        (this.list.items).forEach((item) => {
            listCustomer.push(item.id);
        });
        params['company'] = listCustomer;
        params['payment_term'] = this.listPaymentTerm;
        console.log(params);
        this.epiPolicyService.updateEPIPolicy(id, params).subscribe(res => {
            this.toastr.success(res.message);
            this.router.navigate(['/admin-panel/epi-policy']);
        }, err => {
            console.log(err);
        });
    }

    getDetailEPIPolicy(id) {
        if (id) {
            this.epiPolicyService.getDetailEPIPolicy(id).subscribe(res => {
                if (res.data.invoice_EIP) {
                    this.generalForm.patchValue(res.data.invoice_EIP);
                    this.currentStatus = res.data.invoice_EIP.ac;
                    this.headerTitle = this.generalForm.value['code'] + ': ' + this.generalForm.value['des'];
                }
                if (res.data.company) {
                    this.list.items = res.data.company;
                }
                if (res.data.payment_term) {
                    this.transformListPaymentTerm(res.data.payment_term);
                }
            }, err => {
                console.log(err.message);
            });
        }
    }

    editEPIPolicy(id) {
        this.router.navigate(['/admin-panel/epi-policy/edit', id]);
    }

    addNewCustomer() {
        const modalRef = this.modalService.open(CustomerEPIModalContent, { size: 'lg' });
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
            }
        }, dismiss => { });
    }

    addNewRule(index) {
        this.listPaymentTerm[index].detail.push({
            pay_type: null,
            pay_value: null,
            before_due_dt: null
        });
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
            integerLimit: max || null
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
