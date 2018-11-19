import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import { CommonService } from '../../../../services/common.service';
import { CustomerService } from '../../customer.service';
import { CustomerCreateKeyService } from './keys.control';

//  modal
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SiteModalComponent } from '../../../../shared/modals/site.modal';

import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { ToastrService } from 'ngx-toastr';
import { routerTransition } from '../../../../router.animations';
import { Helper } from '../../../../shared/index';

import { cdArrowTable } from '../../../../shared';
@Component({
    selector: 'app-customer-create',
    templateUrl: './customer-create.component.html',
    styleUrls: ['../customer.component.scss'],
    providers: [CustomerCreateKeyService],
    animations: [routerTransition()]
})
export class CustomerCreateComponent implements OnInit, OnDestroy {

    @ViewChild('addressTable') addressTable: ElementRef;
    @ViewChild('siteTable') siteTable: ElementRef;
    @ViewChild('contactTable') contactTable: ElementRef;
    @ViewChild(cdArrowTable) table: cdArrowTable;

    public selectedAddressIndex = 0;
    public selectedSiteIndex = 0;
    public selectedContactIndex = 0;
    public data = {};

    generalForm: FormGroup;

    public addresses: any = [];
    public bank_accounts: any = [];
    public contacts: any = [];
    public sites: any = [];
    public company_child: any = [];

    public listMaster = {};
    public listTypeAddress: any = [];
    public listCountry: any = [];
    public listBank: any = [];
    public routeList = [];

    public flagAddress: boolean;
    public flagSite: boolean;
    public flagAccount: boolean;
    public flagContact: boolean;
    public flagCreditCard = false;
    public credit_cards = [];

    public countCode: number;
    public textCode: string;

    hotkeyCtrlLeft: Hotkey | Hotkey[];
    hotkeyCtrlRight: Hotkey | Hotkey[];
    public paymentMethodList: any = [];
    public paymentTermList: any = [];

    constructor(
        public fb: FormBuilder,
        public router: Router,
        public toastr: ToastrService,
        public vRef: ViewContainerRef,
        private customerService: CustomerService,
        private modalService: NgbModal,
        private hotkeysService: HotkeysService,
        public keyService: CustomerCreateKeyService,
        private commonService: CommonService,
        public helper: Helper) {
        this.generalForm = fb.group({
            'buyer_type': [null, Validators.required],
            'addresses': [null],
            'contacts': [null],
            'code': [null, Validators.required],
            'full_name': [null],
            'registration_no': [null],
            'bank_accounts': [null],
            'credit_cards': [null],
            'phone': [null, Validators.required],
            'fax': [null],
            'email': [null],
            'credit_limit': [null],
            'ac': [null, Validators.required],
            // 'credit_sts': 2,
            'sale_person_id': [null],
            'first_name': [null],
            'last_name': [null],
            'username': [null],
            'password': [null],
            'pwd_cfrm': [null],
            'company_name': [null],
            'primary': [null],
            'is_main': [true],
            // 'credit_used': [null],
            // 'credit_balance': [null],
            'is_parent': [null],
            'sites': [null],
            'taxable': [null],
            'payment_method_id': [null],
            'payment_term_id': [null]
        });

        // this.hotkeyCtrlRight = hotkeysService.add(new Hotkey('alt+r', (event: KeyboardEvent): boolean => {
        //     this.flagAddress = true;
        //     return false; //  Prevent bubbling
        // }));
        this.keyService.watchContext.next({ context: this, service: this.hotkeysService });
    }

    ngOnInit() {
        /**
         * Init Data
         */
        this.listTypeAddress = [{ id: 1, name: 'Billing' }, { id: 2, name: 'Shipping' }];
        this.getListCustomerType();
        this.getListSalePerson();
        this.getListCountryAdmin();
        this.getListBank();
        this.getListCreditCard();
        this.getListPaymentTerm();
        this.getListPaymentMethod();
        this.customerService.getRoute().subscribe(res => { this.routeList = res.data; });

    }
    getListCreditCard() {
        this.customerService.getCreditCard().subscribe(res => {
            this.getListCreditCard = res.data;
            this.credit_cards.forEach(card => { card.listCard = res.data; });
        });
    }
    getListPaymentTerm() {
        this.customerService.getListPaymentTerm().subscribe(res => {
            this.paymentTermList = res.data;
        });
    }
    getListPaymentMethod() {
        this.customerService.getListPaymentMethod().subscribe(res => {
            this.paymentMethodList = res.data;
        });
    }
    ngOnDestroy() {
        this.hotkeysService.remove(this.hotkeyCtrlLeft);
        this.hotkeysService.remove(this.hotkeyCtrlRight);
    }
    /**
     * get list master data
     */
    getListCustomerType() {
        this.customerService.getListCustomerType().subscribe(res => {
            try {
                this.listMaster['customerType'] = res.data;
            } catch (e) {

            }
        });
    }

    getListTypeAddress() {
        this.customerService.generateSiteCode().subscribe(res => {
            try {
                if (this.generalForm.value.buyer_type === 'CP') {
                    this.generalForm.patchValue({ code: res.data.CP.code });
                    this.countCode = Number(res.data.CP.no);
                    this.textCode = res.data.CP.text;
                } else {
                    this.generalForm.patchValue({ code: res.data.PS.code });
                }
            } catch (e) {

            }
        });
    }

    getListCountryAdmin() {
        this.commonService.getListCountry().subscribe(res => {
            try {
                this.listCountry = res.data;
            } catch (e) {
                console.log(e);
            }
        });
    }

    getListBank() {
        this.commonService.getAllListBank().subscribe(res => {
            try {
                this.listBank = res.data;
            } catch (e) {
                console.log(e);
            }
        });
    }
    //  add new row credi
    addNewCreditCard() {
        this.credit_cards.push({
            'type': null,
            'no': '',
            'name': '',
            'expiration_month': null,
            'expiration_year': null,
            'cvv': null,
            listCard: this.getListCreditCard
        });
    }

    removeCreditCard(index) {
        if (this.credit_cards[index].hasOwnProperty('id')) {
            this.credit_cards[index].is_deleted = true;
            return;
        }
        this.credit_cards.splice(index, 1);
    }
    getListSalePerson() {
        this.commonService.getOrderReference().subscribe(res => {
            try {
                this.listMaster['salePersons'] = res.data.sale_mans;
            } catch (e) {
                console.log(e);
            }
        });
    }
    //  change customer Type
    changeCustomerType() {
        this.getListTypeAddress();

        if (this.generalForm.value.buyer_type === 'CP') {
            const tempType = [{ id: 4, name: 'Head Office' }];

            this.addresses = [{
                type: 4, country_code: null, state_id: null, listType: tempType, listCountry: this.listCountry, listState: []
            }, {
                type: 1, country_code: null, state_id: null, listType: this.listTypeAddress, listCountry: this.listCountry, listState: []
            }, {
                type: 2, country_code: null, state_id: null, listType: this.listTypeAddress, listCountry: this.listCountry, listState: []
            }];
        } else {
            const tempType1 = [{ id: 3, name: 'Primary' }];

            this.addresses = [{
                type: 3, country_code: null, state_id: null, listType: tempType1, listCountry: this.listCountry, listState: []
            }, {
                type: 1, country_code: null, state_id: null, listType: this.listTypeAddress, listCountry: this.listCountry, listState: []
            }, {
                type: 2, country_code: null, state_id: null, listType: this.listTypeAddress, listCountry: this.listCountry, listState: []
            }];
        }
        this.checkAddress();
    }

    changeCountry(item) {
        const params = {
            country: item.country_code
        };
        this.commonService.getStateByCountry(params).subscribe(res => {
            try {
                item.listState = res.data;
            } catch (e) {

            }
        });
    }

    changeBank(item) {

        this.listBank.map(x => {
            if (item.bank_id === x.id) {
                item.bank_swift = x.swift;
            }
        });
        this.commonService.getListBranchByBank(item.bank_id).subscribe(res => {
            try {
                item.listBranch = res.data;
            } catch (e) {

            }
        });
    }

    changeBranch(item) {
        item.full_address = item.listBranch.map(x => {
            if (item.branch_id === x.id) {
                return x.address;
            }
        });
    }

    dupAddress(type) {
        if (type === 3 || type === 4) {
            const p = this.addresses[0];
            const k = Object.keys(p);
            for (let i = 1; i < this.addresses.length; i++) {
                k.map(key => {
                    return key !== 'type' && key !== 'listType' && (this.addresses[i][key] = p[key]);
                });
            }
        } else {
            let tmp = {};
            for (let i = 1; i < this.addresses.length; i++) {
                if (this.addresses[i].type === type) {
                    tmp = JSON.parse(JSON.stringify(this.addresses[i]));
                    break;
                }
            }
            this.addresses.push(tmp);
            this.checkAddress();
        }
    }
    checkAddress() {
        let count1 = 0;
        let count2 = 0;
        console.log(this.addresses);
        this.addresses.forEach(item => {
            if (item.type === 1) {
                count1++;
            }
            if (item.type === 2) {
                count2++;
            }
        });
        if (count1 > 1) {
            this.addresses.forEach(item => {
                if (item.type === 1) {
                    item.hidden = false;
                }
            });
        } else {
            this.addresses.forEach(item => {
                if (item.type === 1) {
                    item.hidden = true;
                }
            });
        }
        if (count2 > 1) {
            this.addresses.forEach(item => {
                if (item.type === 2) {
                    item.hidden = false;
                }
            });
        } else {
            this.addresses.forEach(item => {
                if (item.type === 2) {
                    item.hidden = true;
                }
            });
        }
    }
    // check Contact Ismain
    checkIsMain($event, id) {
        for (let i = 0; i < this.contacts.length; i++) {
            const item = this.contacts[i];
            if (id !== i) {
                item.is_main = false;
            }
        }
    }
    //  add new row address
    addNewAddress() {
        this.addresses.push({
            listType: this.listTypeAddress,
            listCountry: this.listCountry,
            listState: []
        });
    }

    removeAddress(index) {
        this.addresses.splice(index, 1);
        this.checkAddress();
    }

    //  add new row bank account
    addNewBankAccount() {
        this.bank_accounts.push({
            bank_id: null,
            branch_id: null,
            listBank: this.listBank,
            listBranch: []
        });
    }

    removeBankAccount(index) {
        this.bank_accounts.splice(index, 1);
    }
    //  add new row contact
    addNewContact() {
        this.contacts.push({});
    }

    removeContact(index) {
        this.contacts.splice(index, 1);
    }

    checkIsDefault($event, idx) {
        for (let i = 0; i < this.addresses.length; i++) {
            const item = this.addresses[i];
            if (idx !== i && item.type === this.addresses[idx].type) {
                item.is_default = false;
            }
        }
    }
    isNumberKey(evt) {

        const e = evt || window.event; // for trans-browser compatibility
        const charCode = e.which || e.keyCode;
        if (charCode === 46) {
            if (evt.target.value.indexOf('.') === -1) {
                return true;
            }
            return false;
        }
        if (charCode > 31 && (charCode < 47 || charCode > 57)) {
            return false;
        }
        if (e.shiftKey) {
            return false;
        }
        return true;
    }
    isNumberKeyC(evt) {

        const e = evt || window.event; // for trans-browser compatibility
        const charCode = e.which || e.keyCode;
        if (charCode > 31 && (charCode < 47 || charCode > 57)) {
            return false;
        }
        if (e.shiftKey) {
            return false;
        }
        return true;
    }
    //  add new Site

    addNewSite(item?, index?) {
        const k = ['name', 'country_code', 'address_1', 'city', 'state_id', 'zip_code'];
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.addresses.length; i++) {
            // tslint:disable-next-line:prefer-for-of
            for (let j = 0; j < k.length; j++) {
                if (!this.addresses[i][k[j]]) {
                    return this.toastr.error('Please fulfill all the addresses before creating the site.');
                }
            }
        }
        let countCode;
        let textStringCode;
        this.customerService.generateSiteCode().subscribe(res => {
            try {
                this.keyService.saveKeys();
                console.log('start');
                countCode = Number(res.data.CP.no);
                textStringCode = res.data.CP.text;
                const modalRef = this.modalService.open(SiteModalComponent, { size: 'lg' });
                modalRef.componentInstance.item = item;
                modalRef.componentInstance.index = index;
                modalRef.componentInstance.paddr = JSON.parse(JSON.stringify(this.addresses));
                modalRef.componentInstance.isEdit = false;
                modalRef.result.then( _res => {
                    if (this.keyService.keys.length > 0) {
                        this.keyService.reInitKey();
                        this.table.reInitKey(this.data['tableKey']);
                    }
                    if (_res['index'] !== undefined) {
                        this.sites[_res.index] = _res.params;
                    } else {
                        if (!this.helper.isEmptyObject(_res)) {
                            if (!this.helper.isEmptyObject(_res)) {
                                this.sites.push(_res);
                            }
                            console.log(this.sites);
                        }
                    }

                }, dismiss => {
                    if (this.keyService.keys.length > 0) {
                        this.keyService.reInitKey();
                        this.table.reInitKey(this.data['tableKey']);
                    }
                });
                modalRef.componentInstance.info = {
                    parent_company_name: this.generalForm.value.company_name,
                    code: countCode,
                    textCode: textStringCode,
                    payment_method_id: this.generalForm.value.payment_method_id,
                    payment_term_id: this.generalForm.value.payment_term_id,
                    taxable: this.generalForm.value.taxable
                };
            } catch (e) {

            }
        });
    }

    removeSite(index) {
        console.log(index);
        this.sites.splice(index, 1);
        console.log(this.sites);
    }

    createCustomer() {
        if (this.generalForm.valid) {
            const params = this.generalForm.value;
            params['addresses'] = _.cloneDeep(this.addresses);
            params['bank_accounts'] = _.cloneDeep(this.bank_accounts);
            params['contacts'] = _.cloneDeep(this.contacts);
            params['credit_cards'] = _.cloneDeep(this.credit_cards);
            params['addresses'].forEach(item => {
                delete item.listType;
                delete item.listCountry;
                delete item.listState;
            });
            params['bank_accounts'].forEach(item => {
                delete item.listBank;
                delete item.listBranch;
            });
            params['credit_cards'].forEach(res => {
                delete res.listCard;
            });
            params['sites'] = _.cloneDeep(this.sites);
            params['sites'].forEach(item => {
                item.addresses.map(add => {
                    delete add.listType;
                    delete add.listCountry;
                    delete add.listState;
                });
                item.bank_accounts.map(add => {
                    delete add.listBank;
                    delete add.listBranch;
                });
                item.credit_cards.map(res => {
                    delete res.listCard;
                });
            });
            if (params['buyer_type'] === 'CP') {
                delete params['email'];
                delete params['first_name'];
                delete params['last_name'];
                delete params['username'];
                delete params['password'];
                delete params['pwd_cfrm'];
            } else {
                delete params['company_name'];
            }

            if ((params['credit_limit'] + ' ').indexOf('.') >= 0) {
                return this.toastr.error('The credit limit is invalid data');
            }
            if ((params['credit_limit'] + ' ').indexOf('.') >= 0) {
                return this.toastr.error('The credit limit is invalid data');
            }
            if (params['buyer_type'] === 'CP' && params['contacts'].length === 0) {
                return this.toastr.error('The contact field is required.');
            }
            // var isFieldRequired = false;
            // if((params['first_name'] == null|| params['first_name'] == '' &&params['buyer_type'] == 'PS')){
            //     this.toastr.error("The first name is required");
            //     isFieldRequired = true;
            // }
            // if((params['last_name'] == null|| params['last_name'] == '' &&params['buyer_type'] == 'PS')){
            //     this.toastr.error("The last name is required");
            //     isFieldRequired = true;
            // }
            // if((params['email'] == null|| params['email'] == '' &&params['buyer_type'] == 'PS')){
            //     this.toastr.error("The email is required");
            //     isFieldRequired = true;
            // }
            // if(isFieldRequired == true){
            //     return true;
            // }
            // Check Main Contact is checked
             if (params['contacts'].length > 0) {
                const result = params['contacts'].filter(item => item.is_main === true);
                if (result.length === 0) {
                    return this.toastr.error('Please choose at least one main contact for the customer company.');
                }
            }
            this.customerService.createCustomer(params).subscribe(
                res => {
                    console.log(res);
                    try {

                        setTimeout(() => {
                            this.router.navigate(['/customer']);
                        }, 2000);
                        this.toastr.success(res.message);
                    } catch (e) {
                        console.log(e);
                    }
                },
                err => {
                    console.log(err);
                    // this.toastr.error(err.message);
                });

        }

        // this.contacts.forEach(obj => {
        //     obj['pwd_cfrm'] = obj.pwd;
        // });
        // if (this.generalForm.valid) {
        //     const params = { ...this.generalForm.value };
        //     params['user'] = [];
        //     if (this.contacts.length > 0) {
        //         params['user'] = this.contacts;

        //     }
        //     params['banks'] = [];
        //     if (this.bank_accounts.length > 0) {
        //         params['banks'] = this.bank_accounts;

        //     }
        //     params['company_child'] = [];
        //     params['company_child'] = this.company_child;

        //     params['primary'] = [];
        //     params['billing'] = [];
        //     params['shipping'] = [];

        //     this.addresses.forEach(obj => {
        //         if (obj.type === 1) {
        //             params['primary'].push(obj);
        //         }
        //         if (obj.type === 2) {
        //             params['billing'].push(obj);
        //         }
        //         if (obj.type === 3) {
        //             params['shipping'].push(obj);
        //         }
        //     });

        //     if (this.generalForm.value.buyer_type === 'CP') {
        //         delete params.first_name;
        //         delete params.last_name;
        //         delete params.pwd;
        //         delete params.pwd_cfrm;
        //         delete params.username;
        //         delete params.email;
        //     } else {
        //         params.pwd_cfrm = params.pwd;
        //         delete params.full_name;

        //     }
        //     const data = { ...params };
        //     // data.banks.forEach(item => {
        //     //     delete item.listBank;
        //     //     delete item.listBranch;
        //     // });
        //     console.log(data);
        //     // return;

        //     this.customerService.createCustomer(data).subscribe(
        //         res => {
        //             console.log(res);
        //             try {

        //                 setTimeout(() => {
        //                     this.router.navigate(['/customer']);
        //                 }, 2000);
        //                 this.toastr.success(res.message);
        //             } catch (e) {
        //                 console.log(e);
        //             }
        //         },
        //         err => {
        //             console.log(err);
        //             this.toastr.error(err.message);
        //         });
        // }

    }

    selectAddressTable() {
        this.selectedAddressIndex = 0;
        this.addressTable.nativeElement.querySelector('td a').focus();
    }

    selectSiteTable() {
        this.selectedSiteIndex = 0;
        this.siteTable.nativeElement.querySelector('td a').focus();
    }

    selectContactTable() {
        this.selectedContactIndex = 0;
        this.contactTable.nativeElement.querySelector('td a').focus();
    }
}
