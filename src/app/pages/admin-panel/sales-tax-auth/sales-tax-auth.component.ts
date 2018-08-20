import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TableService } from './../../../services/table.service';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { routerTransition } from '../../../router.animations';

import { ConfirmModalContent } from '../../../shared/modals/confirm.modal';

import { SalesTaxAuthService } from './sales-tax-auth.service';

@Component({
    selector: 'app-sales-tax-auth',
    templateUrl: './sales-tax-auth.component.html',
    styleUrls: ['./sales-tax-auth.component.scss'],
    animations: [routerTransition()],
    providers: [SalesTaxAuthService]
})
export class SalesTaxAuthComponent implements OnInit {
    /**
     * letiable Declaration
     */
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
        ]
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

    constructor(
        public router: Router,
        public fb: FormBuilder,
        public toastr: ToastrService,
        public tableService: TableService,
        public modalService: NgbModal,
        public salesTaxAuthService: SalesTaxAuthService
    ) {
        this.countryGeneralForm = fb.group({
            country_id: [null, Validators.required],
            display_name: [null, Validators.required],
            tax_type_id: [null, Validators.required],
            ac: [null, Validators.required]
        });

        this.stateGeneralForm = fb.group({
            state: [null, Validators.required],
            code: [null, Validators.required],
            name: [null, Validators.required],
            nexus: [null, Validators.required],
            base: [null, Validators.required],
            shipping: [null, Validators.required],
            status: [null, Validators.required]
        });
        this.stateRateForm = fb.group({
            current_rate: [null, Validators.required],
            effect_date: [null, Validators.required],
            gl_acc: [null, Validators.required]
        });
    }

    ngOnInit() {
        this.getListSalesTaxAuthority();
        this.getListCountryDropDown();
        this.getTaxAuthorityTypes();
    }

    /**
     * Internal Function
     */

    getListSalesTaxAuthority() {
        this.salesTaxAuthService.getListSalesTax().subscribe(
            res => {
                try {
                    this.listSalesTax = res.data;
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
                    this.selectedCountryTax = res.data ;
                    this.countryGeneralForm.patchValue(this.selectedCountryTax);
                    this.currentForm = 'country';
                    this.isClickedSave = false;
                    this.isCreateNew = false;
                } catch (err) {
                    console.log(err);
                }
            },
            err => {
                console.log(err);
            }
        );
    }

    getListCountryDropDown() {
        this.salesTaxAuthService.getListCountryDropDown().subscribe(
            res => {
                try {
                    this.listMaster.countries = res.data;
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
                    res.data = [res.data];
                    res.data.forEach(item => {
                        this.listMaster.tax_auth_types.push({
                            id: Object.keys(item)[0],
                            display_name: item[Object.keys(item)[0]]
                        });
                    });
                } catch (err) {
                    console.log(err);
                }
            },
            err => {
                console.log(err);
            }
        );
    }

    onClickNew(type) {
        if ((type === 'country' && this.selectedCountryTax['id']) || (type === 'country' && this.selectedCountryTax['id'])) {
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
                    this.onClickReset();
                }
            }, dismiss => { });
        } else {
            this.currentForm = type;
            this.isCreateNew = true;
            this.selectedCountryTax = {};
            this.selectedStateTax = {};
            this.onClickReset();
        }
    }

    onSelectCountryTax(countryTax) {
        this.selectedStateTax = {};
        this.getCountryTaxAuthorityDetail(countryTax['id']);
    }

    onSelectStateTax(stateTax, countryTax) {
        this.selectedStateTax = stateTax;
        this.selectedCountryTax = {};
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

    onSaveTaxAuthority() {
        this.isClickedSave = true;
        if ( this.isCreateNew && this.currentForm === 'country' && this.validateCountryGeneralForm()) {
            this.onCreateCountryTaxAuthority();
        }
        if ( this.isCreateNew && this.currentForm === 'state' && this.validateStateGeneralForm() && this.validateStateRateForm()) {
            this.onCreateStateTaxAuthority();
        }
        if ( !this.isCreateNew && this.currentForm === 'country' && this.validateCountryGeneralForm()) {
            this.onUpdateCountryTaxAuthority();
        }
        if ( !this.isCreateNew && this.currentForm === 'state' && this.validateStateGeneralForm() && this.validateStateRateForm()) {
            this.onUpdateStateTaxAuthority();
        }
    }

    onCreateCountryTaxAuthority() {
        const params =  { ...this.countryGeneralForm.value };
        params['ac'] = params['ac'].toString();
        this.salesTaxAuthService.createCountryTaxAuthority(params).subscribe(
            res => {
                try {
                    this.isClickedSave = false;
                    this.currentForm = {};
                    this.isCreateNew = false;
                    this.countryGeneralForm.reset();
                    this.getListSalesTaxAuthority();
                    this.toastr.success(res.message);
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
        const params =  { ...this.countryGeneralForm.value };
        params['ac'] = params['ac'].toString();
        this.salesTaxAuthService.updateCountryTaxAuthority(this.selectedCountryTax['id'] , params).subscribe(
            res => {
                try {
                    this.isClickedSave = false;
                    this.currentForm = {};
                    this.isCreateNew = false;
                    this.countryGeneralForm.reset();
                    this.getListSalesTaxAuthority();
                    this.toastr.success(res.message);
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
        const params =  { ...this.stateGeneralForm.value, ...this.stateRateForm.value };
        console.log(params);
    }

    onUpdateStateTaxAuthority() {
        const params =  { ...this.stateGeneralForm.value, ...this.stateRateForm.value };
        console.log(params);
    }

    onClickReset() {
        this.countryGeneralForm.reset();
        this.stateGeneralForm.reset();
        this.stateRateForm.reset();

        this.isClickedSave = false;
    }
}
