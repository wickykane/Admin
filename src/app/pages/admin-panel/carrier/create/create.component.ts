import { Component, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { routerTransition } from '../../../../router.animations';
import { CommonService } from '../../../../services/common.service';
import { CarrierService } from '../carrier.service';


@Component({
    selector: 'app-carrier-create',
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.scss'],
    animations: [routerTransition()]
})
export class CreateComponent implements OnInit {

    generalForm: FormGroup;
    primaryAddress: FormGroup;
    billingAddress: FormGroup;
    listMaster = {};
    listBankAccount = [];
    id: any = null;

    constructor(
        public router: Router,
        public fb: FormBuilder,
        public toastr: ToastrService,
        private vRef: ViewContainerRef,
        private activeRouter: ActivatedRoute,
        private cos: CommonService,
        private cs: CarrierService
    ) {
        this.generalForm = fb.group({
            'name': [null, Validators.required],
            'from_weight': [null, Validators.required],
            'to_weight': [null, Validators.required],
            'ctt_person': [null],
            'ctt_email': [null],
            'ctt_phone': [null],
            'website': [null],
            'own_carrier': false,
            'dt_of_crtn': new Date()
        });

        const addrConfig = {
            'id': [null],
            'email': [null],
            'tax_number': [null],
            'phone': [null],
            'address_line': [null, Validators.required],
            'country_code': [null, Validators.required],
            'state_id': [null],
            'city_name': [null, Validators.required],
            'zip_code': [null, Validators.required],
            'name': [null]
        };

        this.primaryAddress = fb.group(addrConfig);
        this.billingAddress = fb.group(addrConfig);
    }

    ngOnInit() {
        setTimeout(() => {
            this.getListCountry();
            this.getListBank();
            this.activeRouter.params.subscribe(params => {
                if (params.id) {
                    this.id = params.id;
                    this.getCarrierById(params.id);
                }
            });
        });
    }

    setData(data) {
        console.log(data);

        this.getStateByCountry(data.primary.country_code, 'primary');
        this.getStateByCountry(data.billing.country_code, 'billing');

        this.generalForm.patchValue(data);
        this.primaryAddress.patchValue(data.primary);
        this.billingAddress.patchValue(data.billing);
        data.banks.forEach(e => {
            this.setBankData(e);
        });
        this.listBankAccount = data.banks;
    }

    setBankData(e) {
        if (!this.listMaster['bank']) {
            setTimeout(() => {
                this.setBankData(e);
            }, 500);
            return;
        }

        this.bankChange(e.bank_id, e, true);
        this.setBranchData(e);
    }

    setBranchData(e) {
        if (!e.list_branch) {
            setTimeout(() => {
                this.setBranchData(e);
            }, 500);
            return;
        }

        this.branchChange(e.bank_branch_id, e);
    }

    getCarrierById(id) {
        this.cs.getCarrierById(id).subscribe(res => {
            this.setData(res.data);
        });
    }

    getStateByCountry(country_code, type) {
        this.cos.getStateByCountry({country: country_code}).subscribe(res => {
            this.listMaster[type + 'State'] = res.data;
        });
    }

    getListCountry() {
        this.cos.getListCountry().subscribe(res => {
            this.listMaster['countries'] = res.data;
        });
    }

    getListBank() {
        this.cs.getListBank().subscribe(res => {
            this.listMaster['bank'] = res.data.rows;
        });
    }

    bankChange(id, item, is) {
        item.swift = this.listMaster['bank'].filter(e => e.id === Number(id))[0].swift;
        item.bank_branch_id = (is) ? item.bank_branch_id : null;
        item.address = null;

        this.cs.getBranchByBank(id).subscribe(res => {
            item.list_branch = res.data.rows;
        });
    }

    branchChange(id, item) {
        const branch = item.list_branch.filter(e => e.id === Number(id))[0];
        item.address = (branch.address || '') + ' ' + (branch.city || '') + ' ' + (branch.state_name || '') + ' ' + (branch.country_name || '');
    }

    removeBankAccount(index, item) {
        this.listBankAccount.splice(index, 1);
    }

    addNewBank() {
        this.listBankAccount.push({bank_id: null, bank_branch_id: null});
    }

    copyAddress() {
        this.listMaster['billingState'] = [ ...this.listMaster['primaryState'] ];
        this.billingAddress.patchValue(this.primaryAddress.value);
    }

    convertBank() {
        const arr = [];
        this.listBankAccount.forEach(e => {
            if (e.bank_id && e.bank_branch_id) {
                arr.push({ ...e });
            }
        });

        return arr;
    }

    valid() {
        return this.primaryAddress.valid && this.generalForm.valid && this.billingAddress.valid;
    }

    confirm() {
        const param = { ...this.generalForm.value, banks: this.convertBank(), primary: { ...this.primaryAddress.value }, billing: { ...this.billingAddress.value } };

        if (this.id) {
            this.cs.putCarrierById(this.id, param).subscribe(res => {
                this.toastr.success(res.message);
                setTimeout(() => {
                    this.router.navigate(['/admin-panel/carrier']);
                });
            });
        } else {
            this.cs.createCarrier(param).subscribe(res => {
                this.toastr.success(res.message);
                setTimeout(() => {
                    this.router.navigate(['/admin-panel/carrier']);
                });
            });
        }
    }
}
