import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { routerTransition } from '../../../../router.animations';
import { CommonService } from '../../../../services/common.service';
import { CarrierService } from '../carrier.service';
import { CarrierCreateKeyService } from './keys.control';


@Component({
    selector: 'app-carrier-create',
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.scss'],
    providers: [CarrierCreateKeyService],
    animations: [routerTransition()],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateComponent implements OnInit {

    generalForm: FormGroup;
    primaryAddress: FormGroup;
    billingAddress: FormGroup;
    listMaster = {};
    listBankAccount = [];
    id: any = null;

    constructor(
        private cd: ChangeDetectorRef,
        public router: Router,
        public fb: FormBuilder,
        public toastr: ToastrService,
        private vRef: ViewContainerRef,
        private activeRouter: ActivatedRoute,
        private cos: CommonService,
        private cs: CarrierService,
        public keyService: CarrierCreateKeyService
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
        this.keyService.watchContext.next(this);

        const addrConfig = {
            'id': [null],
            'email': [null],
            'fax': [null],
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
        this.getGenerateCode();
        (async () => {
            await new Promise((calback) => { this.getListCountry(calback); });
            await new Promise((calback) => { this.getListBank(calback); });
            this.activeRouter.params.subscribe(params => {
                if (params.id) {
                    this.id = params.id;
                    this.getCarrierById(params.id);
                }
            });
        })();
    }

    refresh() {
        this.cd.detectChanges();
    }

    toNumber(str) {
      return Number(str);
    }

    setData(data) {
        this.getStateByCountry(data.primary.country_code, 'primary');
        this.getStateByCountry(data.billing.country_code, 'billing');

        this.generalForm.patchValue(data);
        this.primaryAddress.patchValue(data.primary);
        this.billingAddress.patchValue(data.billing);
        data.banks.forEach(e => {
            (async () => {
                await new Promise((calback) => { this.bankChange(e.bank_id, e, calback); });
                this.branchChange(e.bank_branch_id, e);
            })();
        });
        this.listBankAccount = data.banks;
        this.refresh();
    }
    numberMaskObject(max?) {
        return createNumberMask({
            allowDecimal: true,
            prefix: '',
            includeThousandsSeparator : false,
            integerLimit: max || null
        });
    }

    getCarrierById(id) {
        this.cs.getCarrierById(id).subscribe(res => {
            this.setData(res.data);
            this.refresh();
        });
    }

    getStateByCountry(country_code, type) {
        this.cos.getStateByCountry({country: country_code}).subscribe(res => {
            this.listMaster[type + 'State'] = res.data;
            this.refresh();
        });
    }

    getGenerateCode() {
        this.cs.getGenerateCode().subscribe(res => {
            this.listMaster['generate-code'] = res.message;
            this.refresh();
        });
    }

    getListCountry(calback) {
        this.cos.getListCountry().subscribe(res => {
            this.listMaster['countries'] = res.data;
            calback();
            this.refresh();
        });
    }

    getListBank(calback) {
        this.cs.getListBank().subscribe(res => {
            this.listMaster['bank'] = res.data.rows;
            calback();
            this.refresh();
        });
    }

    bankChange(id, item, calback) {
        item.swift = this.listMaster['bank'].filter(e => e.id === Number(id))[0].swift;
        item.bank_branch_id = (calback) ? item.bank_branch_id : null;
        item.address = null;

        this.cs.getBranchByBank(id).subscribe(res => {
            item.list_branch = res.data.rows;
            if (calback) { calback(); }
            this.refresh();
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
        this.listMaster['billingState'] = [ ...(this.listMaster['primaryState'] || []) ];
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
                this.refresh();
                setTimeout(() => {
                    this.router.navigate(['/admin-panel/carrier']);
                }, 500);
            });
        } else {
            this.cs.createCarrier(param).subscribe(res => {
                this.toastr.success(res.message);
                this.refresh();
                setTimeout(() => {
                    this.router.navigate(['/admin-panel/carrier']);
                }, 500);
            });
        }
    }
}
