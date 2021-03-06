import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TableService } from './../../../services/table.service';

import { NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { routerTransition } from '../../../router.animations';
import { NgbDateCustomParserFormatter } from '../../../shared/helper/dateformat';

import { ConfirmModalContent } from '../../../shared/modals/confirm.modal';

import { SalesTaxAuthService } from './sales-tax-auth.service';

import * as moment from 'moment';

import { HotkeysService } from 'angular2-hotkeys';
import { StorageService } from '../../../services/storage.service';
import { SaleTaxKeyService } from './keys.control';
@Component({
    selector: 'app-sales-tax-auth',
    templateUrl: './sales-tax-auth.component.html',
    styleUrls: ['./sales-tax-auth.component.scss'],
    animations: [routerTransition()],
    providers: [SalesTaxAuthService, { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }, SaleTaxKeyService],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SalesTaxAuthComponent implements OnInit {
    /**
     * letiable Declaration
     */
    //#region initialize variables
    public listMaster = {
        countries: [],
        tax_auth_types: [],
        status: [
            {
                key: null,
                name: '--Select--'
            },
            {
                key: 0,
                name: 'Inactive'
            },
            {
                key: 1,
                name: 'Active'
            }
        ],
        state_nexus: [
            {
                key: null,
                name: '--Select--'
            },
            {
                key: 0,
                name: 'Yes'
            },
            {
                key: 1,
                name: 'No'
            }
        ],
        states: [],
        cal_tax_base_on: [],
        sale_tax_on_shippping: [],
        gl_accounts: []
    };

    public currentForm = null;
    public isCreateNew = false;
    public isClickedSave = false;

    public listSalesTax = [];
    public selectedCountryTax = {};
    public selectedStateTax = {};

    public countryGeneralForm: FormGroup;
    public stateGeneralForm: FormGroup;
    public stateRateForm: FormGroup;

    // public oldRate = null;
    public newRate = null;
    public newRateTemp = null;

    public todayDate = moment().format('YYYY-MM-DD');
    //#endregion initialize variables

    //#region constructor
    constructor(
        private cd: ChangeDetectorRef,
        public router: Router,
        public fb: FormBuilder,
        public toastr: ToastrService,
        public tableService: TableService,
        public modalService: NgbModal,
        public salesTaxAuthService: SalesTaxAuthService,
        private storage: StorageService,
        private _hotkeysService: HotkeysService,
        public keyService: SaleTaxKeyService
    ) {
        this.countryGeneralForm = fb.group({
            country_id: [null, Validators.required],
            display_name: [null, Validators.required],
            tax_type_id: [null, Validators.required],
            ac: [null, Validators.required]
        });

        this.stateGeneralForm = fb.group({
            state_id: [null, Validators.required],
            state_code: [null, Validators.required],
            display_name: [null, Validators.required],
            state_nexus: [null, Validators.required],
            cal_tax_based_on: [null, Validators.required],
            tax_on_shipping: [null, Validators.required],
            ac: [null]
        });
        this.stateRateForm = fb.group({
            current_rate: [null, Validators.required],
            effective_date: [null, Validators.required],
            gl_account_id: [null, Validators.required]
        });
        this.keyService.watchContext.next({ context: this, service: this._hotkeysService });
    }
    //#endregion constructor

    //#region lifecycle hook
    ngOnInit() {
        this.listMaster['permission'] = this.storage.getRoutePermission(this.router.url);
        this.getListSalesTaxAuthority();
        this.getListCountryDropDown();
        this.getTaxAuthorityTypes();
        this.getCalTaxBaseOn();
        this.getSaleTaxOnShipping();
        this.getGLAccount();
    }
    //#endregion lifecycle hook

    /**
     * Internal Function
     */
    //#region load list master
    refresh() {
        if (!this.cd['destroyed']) { this.cd.detectChanges(); }
    }

    getListCountryDropDown() {
        this.salesTaxAuthService.getListCountryDropDown().subscribe(
            res => {
                try {
                    this.listMaster.countries = res.data;
                    this.refresh();
                } catch (err) {
                    console.log(err);
                }
            },
            err => {
                console.log(err);
            }
        );
    }

    getTaxAuthorityTypes() {
        this.salesTaxAuthService.getTaxAuthorityTypes().subscribe(
            res => {
                try {
                    this.listMaster.tax_auth_types = res.data;
                    this.refresh();
                } catch (err) {
                    console.log(err);
                }
            },
            err => {
                console.log(err);
            }
        );
    }

    getStateList(countryCode) {
        this.salesTaxAuthService.getStateDropdownList(countryCode).subscribe(
            res => {
                try {
                    this.listMaster.states = res.data;
                    this.refresh();
                } catch (err) {
                    console.log(err);
                }
            },
            err => {
                console.log(err);
            }
        );
    }

    getCalTaxBaseOn() {
        this.salesTaxAuthService.getCalTaxBaseOn().subscribe(
            res => {
                try {
                    this.listMaster.cal_tax_base_on = res.data;
                    this.refresh();
                } catch (err) {
                    console.log(err);
                }
            },
            err => {
                console.log(err);
            }
        );
    }

    getSaleTaxOnShipping() {
        this.salesTaxAuthService.getSalesTaxOnShipping().subscribe(
            res => {
                try {
                    this.listMaster.sale_tax_on_shippping = res.data;
                    this.refresh();
                } catch (err) {
                    console.log(err);
                }
            },
            err => {
                console.log(err);
            }
        );
    }
    getGLAccount() {
        this.salesTaxAuthService.getGLAccount().subscribe(
            res => {
                try {
                    // this.listMaster.gl_accounts = res.data;
                    const accountList = res['data'];
                    const tempAccountList = [];
                    accountList.forEach(item => {
                        tempAccountList.push({ 'name': item.name, 'level': item.level, 'disabled': true }, ...item.children);
                    });
                    this.listMaster.gl_accounts = tempAccountList;
                    this.refresh();
                } catch (err) {
                    console.log(err);
                }
            },
            err => {
                console.log(err);
            }
        );
    }
    //#endregion load list master

    //#region load tree list and detail
    getListSalesTaxAuthority() {
        this.salesTaxAuthService.getListSalesTax().subscribe(
            res => {
                try {
                    this.listSalesTax = res.data;
                    this.refresh();
                } catch (err) {
                    console.log(err);
                }
            },
            err => {
                console.log(err);
            }
        );
    }

    getCountryTaxAuthorityDetail(countryId) {
        this.salesTaxAuthService.getCountryTaxAuthorityDetail(countryId).subscribe(
            res => {
                try {
                    this.selectedCountryTax = res.data;
                    this.countryGeneralForm.patchValue(this.selectedCountryTax);
                    this.currentForm = 'country';
                    this.isClickedSave = false;
                    this.isCreateNew = false;
                    this.getStateList(this.selectedCountryTax['country_code']);
                    this.refresh();
                } catch (err) {
                    console.log(err);
                }
            },
            err => {
                console.log(err);
            }
        );
    }

    getStateTaxAuthorityDetail(stateId, currentRate) {
        this.salesTaxAuthService.getStateTaxAuthorityDetail(stateId).subscribe(
            res => {
                try {
                    this.selectedStateTax = res.data;
                    this.stateGeneralForm.patchValue(this.selectedStateTax);
                    this.stateRateForm.patchValue(this.selectedStateTax);
                    this.stateGeneralForm.controls.state_code.setValue(this.selectedStateTax['state']['code']);
                    this.getStateList(this.selectedStateTax['state']['country_code']);
                    this.selectedStateTax['current_rate'] = currentRate || res.data['current_rate'];
                    this.currentForm = 'state';
                    this.isClickedSave = false;
                    this.isCreateNew = false;
                    this.refresh();
                } catch (err) {
                    console.log(err);
                }
            },
            err => {
                console.log(err);
            }
        );
    }
    //#endregion load tree list and detail

    //#region handle onlick-onselect
    onClickNew(type) {
        if (type === 'country' && this.selectedCountryTax['id']) {
            const modalRef = this.modalService.open(ConfirmModalContent);
            modalRef.componentInstance.message = 'Unsaved data will be lost! Do you want to continue?';
            modalRef.componentInstance.yesButtonText = 'YES';
            modalRef.componentInstance.noButtonText = 'NO';
            modalRef.result.then(result => {
                if (result) {
                    this.currentForm = type;
                    this.isCreateNew = true;
                    this.selectedCountryTax = {};
                    this.selectedStateTax = {};
                    this.onResetForm();
                }
            }, dismiss => { });
        } else {
            this.currentForm = type;
            this.isCreateNew = true;
            this.selectedStateTax = {};
            this.onResetForm();
            if (type === 'state') {
                this.stateRateForm.controls.effective_date.setValue(this.todayDate);
            } else {
                this.selectedCountryTax = {};
            }
        }
        this.cd.detectChanges();
    }

    onSelectCountryTax(countryTax) {
        this.selectedStateTax = {};
        this.onResetForm();
        this.getCountryTaxAuthorityDetail(countryTax['id']);
    }

    onSelectStateTax(stateTax) {
        this.selectedCountryTax = {};
        this.onResetForm();
        this.getStateTaxAuthorityDetail(stateTax['id'], null);
    }

    onSelectStateDropdown(selectedState) {
        if (selectedState) {
            const state = this.listMaster.states.find(_ => _.id === selectedState.id);
            this.stateGeneralForm.controls.state_code.setValue(state.code);
        }
    }

    checkEffectiveDate() {
        if (moment(this.stateRateForm.value.effective_date).isBefore(this.todayDate)) {
            this.toastr.error('The new effective Date can not be less than current date.');
            this.stateRateForm.controls.effective_date.setValue(this.todayDate);
        }
    }

    onCheckNewRate() {
        if (this.newRate === null || this.newRate === '') {
            this.stateRateForm.controls.effective_date.setValue(this.selectedStateTax['effective_date']);
        } else if (this.newRate !== this.newRateTemp) {
            this.stateRateForm.controls.effective_date.setValue(this.todayDate);
        }
        this.newRateTemp = this.newRate;
    }

    onClickReset() {
        this.onResetForm();
        if (this.selectedCountryTax['id']) {
            this.countryGeneralForm.patchValue(this.selectedCountryTax);
        }
        if (this.selectedStateTax['id']) {
            this.stateGeneralForm.patchValue(this.selectedStateTax);
            this.stateRateForm.patchValue(this.selectedStateTax);
            const state = this.listMaster.states.find(_ => _.id === this.selectedStateTax['state_id']);
            this.stateGeneralForm.controls.state_code.setValue(state.code);
        }
    }

    onSaveTaxAuthority() {
        this.stateRateForm.controls['effective_date'].setErrors(null);
        this.isClickedSave = true;
        if (this.listMaster['permission'].create && this.isCreateNew && this.currentForm === 'country' && this.validateCountryGeneralForm()) {
            this.onCreateCountryTaxAuthority();
        }
        if (this.listMaster['permission'].create && this.isCreateNew && this.currentForm === 'state' && this.validateStateGeneralForm() && this.validateStateRateForm()) {
            this.onCreateStateTaxAuthority();
        }
        if (this.listMaster['permission'].edit && !this.isCreateNew && this.currentForm === 'country' && this.validateCountryGeneralForm()) {
            this.onUpdateCountryTaxAuthority();
        }
        if (this.listMaster['permission'].edit && !this.isCreateNew && this.currentForm === 'state' && this.validateStateGeneralForm() && this.validateStateRateForm()) {
            this.onUpdateStateTaxAuthority();
        }
    }
    //#endregion handle onclick-onselect

    //#region call API for Save data
    onCreateCountryTaxAuthority() {
        const params = { ...this.countryGeneralForm.value };
        params['ac'] = params['ac'].toString();
        this.salesTaxAuthService.createCountryTaxAuthority(params).subscribe(
            res => {
                try {
                    this.handleFinishSaveCountry();
                    this.toastr.success(res.message);
                    this.refresh();
                } catch (err) {
                    console.log(err);
                }
            },
            err => {
                console.log(err);
            }
        );
    }

    onUpdateCountryTaxAuthority() {
        const params = { ...this.countryGeneralForm.value };
        params['ac'] = params['ac'].toString();
        this.salesTaxAuthService.updateCountryTaxAuthority(this.selectedCountryTax['id'], params).subscribe(
            res => {
                try {
                    this.handleFinishSaveCountry();
                    this.toastr.success(res.message);
                    this.refresh();
                } catch (err) {
                    console.log(err);
                }
            },
            err => {
                console.log(err);
            }
        );
    }

    onCreateStateTaxAuthority() {
        const params = { ...this.stateGeneralForm.value, ...this.stateRateForm.value };
        params['tax_authority_country_id'] = this.selectedCountryTax['id'];
        params['ac'] = '1';
        this.salesTaxAuthService.createStateTaxAuthority(params).subscribe(
            res => {
                try {
                    this.handleFinishSaveState();
                    this.toastr.success(res.message);
                    this.refresh();
                } catch (err) {
                    console.log(err);
                }
            },
            err => {
                console.log(err);
            }
        );
    }

    onUpdateStateTaxAuthority() {
        const params = { ...this.stateGeneralForm.value, ...this.stateRateForm.value };
        params['tax_authority_country_id'] = this.selectedStateTax['tax_authority_country_id'];
        params['current_rate'] = (this.newRate !== null && this.newRate !== '') ? this.newRate : params['current_rate'];
        Object.keys(params).forEach(key => {
            params[key] = params[key].toString();
        });

        // const tempOldRate = this.selectedStateTax['current_rate'];

        this.salesTaxAuthService.updateStateTaxAuthority(this.selectedStateTax['id'], params).subscribe(
            res => {
                try {
                    this.getListSalesTaxAuthority();
                    // this.oldRate = this.newRate !== null ? this.newRate : null;
                    if (!moment(this.stateRateForm.value.effective_date).isAfter(this.todayDate)) {
                        this.getStateTaxAuthorityDetail(this.selectedStateTax['id'], null);
                        // this.oldRate = tempOldRate;
                        this.newRate = null;
                    } else {
                        this.getStateTaxAuthorityDetail(this.selectedStateTax['id'], this.selectedStateTax['current_rate']);
                    }
                    this.newRateTemp = this.newRate;
                    this.toastr.success(res.message);
                    this.refresh();
                } catch (err) {
                    console.log(err);
                }
            },
            err => {
                console.log(err);
            }
        );
    }
    //#endregion call API for Save data

    //#region utility functions
    handleFinishSaveCountry() {
        this.isClickedSave = false;
        this.currentForm = '';
        this.isCreateNew = false;
        this.selectedCountryTax = {};
        this.countryGeneralForm.reset();
        this.getListSalesTaxAuthority();
    }

    handleFinishSaveState() {
        this.handleFinishSaveCountry();
        this.selectedStateTax = {};
        this.stateGeneralForm.reset();
        this.stateRateForm.reset();
        this.stateRateForm.controls.effective_date.setValue(this.todayDate);
    }

    validateCountryGeneralForm() {
        if (this.countryGeneralForm.invalid) {
            return false;
        }
        return true;
    }

    validateStateGeneralForm() {
        if (this.stateGeneralForm.invalid) {
            return false;
        }
        return true;
    }

    validateStateRateForm() {
        if (this.stateRateForm.invalid) {
            return false;
        }
        return true;
    }

    onResetForm() {
        this.newRate = null;
        this.newRateTemp = null;
        this.countryGeneralForm.reset();
        this.stateGeneralForm.reset();
        this.stateRateForm.reset();
        this.stateRateForm.controls.effective_date.setValue(this.todayDate);
        this.isClickedSave = false;
    }
    //#endregion utility functions
    back() {
        this.router.navigate(['/admin-panel']);
    }
}
