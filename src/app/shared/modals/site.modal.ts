import { state } from '@angular/animations';
import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TableService } from './../../services/table.service';

import { CustomerService } from '../../pages/customer-mgmt/customer.service';
import { ItemService } from './item.service';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../services/common.service';
import { Helper } from './../helper/common.helper';

import { cdArrowTable } from '../../shared';
@Component({
    selector: 'app-site-modal',
    templateUrl: './site.modal.html',
    providers: [HotkeysService],
    styleUrls: ['./site.modal.scss']
})
export class SiteModalComponent implements OnInit, OnDestroy {

    @ViewChild('addressTableModal') addressTableModal: ElementRef;
    @ViewChild('contactTableModal') contactTableModal: ElementRef;

    public selectedAddressIndex = 0;
    public selectedContactIndex = 0;

    public data = {};

    @Input() info;
    @Input() item;
    @Input() paddr;
    @Input() index;
    @Input() isEdit;
    /**
     * Variable Declaration
     */
    generalForm: FormGroup;

    public addresses: any = [];
    public bank_accounts: any = [];
    public bank_card: any = [];
    public contacts: any = [];

    public listMaster = {};
    public listTypeAddress: any = [];
    public listCountry: any = [];
    public listBank: any = [];
    public routeList = [];
    public credit_cards = [];
    public getListCreditCard;
    public flagAddress: boolean;
    public flagAccount: boolean;
    public flagContact: boolean;
    public flagCreditCard = false;

    hotkeyCtrlLeft: Hotkey | Hotkey[];
    hotkeyCtrlRight: Hotkey | Hotkey[];
    public paymentMethodList: any = [];
    public paymentTermList: any = [];
    constructor(public fb: FormBuilder,
        private helper: Helper,
        public router: Router,
        public toastr: ToastrService,
        private itemService: ItemService,
        private customerService: CustomerService,
        private modalService: NgbModal,
        public _hotkeysService: HotkeysService,
        private commonService: CommonService,
        public activeModal: NgbActiveModal) {

        this.generalForm = fb.group({
            'parent_company_name': [null],
            'site_code': [null, Validators.required],
            'site_name': [null, Validators.required],
            'registration_no': [null],
            'phone': ['', Validators.required],
            'fax': [''],
            'credit_limit': [null],
            'credit_sts': 2,
            'sale_person_id': [null],
            'payment_make': [1, Validators.required],
            'site_id': [null],
            'taxable': [null],
            'payment_method_id': [null],
            'payment_term_id': [null]
        });

        // this.hotkeyCtrlRight = _hotkeysService.add(new Hotkey('alt+r', (event: KeyboardEvent): boolean => {
        //     this.flagAddress = true;
        //     return false; //  Prevent bubbling
        // }));
        this.getListPaymentTerm();
        this.getListPaymentMethod();

    }

    ngOnInit() {
        (async () => {
            await this.itemService.getListCountryAdmin().subscribe(res => { this.listCountry = res.data; this.changeCustomerType(); });
            this.listTypeAddress = [{ id: 1, name: 'Billing' }, { id: 2, name: 'Shipping' }];
            await this.commonService.getOrderReference().subscribe(res => this.listMaster['salePersons'] = res.data.sale_mans);
            // await this.commonService.getAllListBank().subscribe(res => this.listBank = res.data);
            await this.customerService.getRoute().subscribe(res => { this.routeList = res.data; });
            // await this.customerService.getCreditCard().subscribe(res => { this.getListCreditCard = res.data; this.credit_cards.forEach(card => { card.listCard = res.data }); });

            this.setData();
        })();
        this.initKeyBoard();
    }

    ngOnDestroy() {
        this.resetKeys();
    }
    //#region old code
    setData() {
        if (this.item) {
            this.generalForm.patchValue(this.item);
            this.contacts = this.item.contacts;
            this.addresses = this.item.addresses;
            this.bank_accounts = this.item.bank_accounts;
            this.credit_cards = this.item.credit_cards;
            (this.item['site_id'] !== undefined) ?   (this.isEdit = true) :  (this.isEdit = false);
            // this.orderAddress(this.addresses);
        } else {
            let code = this.info.code;
            code++;
            this.isEdit = false;
            this.generalForm.patchValue({ parent_company_name: this.info.parent_company_name });
            this.generalForm.patchValue({ site_code: String(this.info.textCode + '0000' + code) });
            this.generalForm.patchValue({ payment_method_id: this.info.payment_method_id });
            this.generalForm.patchValue({ payment_term_id: this.info.payment_term_id });
            this.generalForm.patchValue({ taxable: this.info.taxable });
            this.changePayment({target: {value: this.generalForm.value.payment_make}});
        }
        this.checkAddress();
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
    private orderAddress(address) {
        const  tmp = [];
        const  arr = [4, 3, 1, 2];
        arr.forEach(v => {
            // tslint:disable-next-line:prefer-for-of
            for (let i = 0; i < address.length; i++) {
                if (address[i].type === v) {
                    tmp.push(address[i]);
                }
            }
        });
        this.addresses = JSON.parse(JSON.stringify(tmp));
    }
    //  change customer Type
    changeCustomerType() {
        const tempType1 = [{ id: 4, name: 'Head Office' }];
        this.addresses = [{
            type: 4, country_code: null, state_id: null, listType: tempType1, listCountry: this.listCountry, listState: [], name: '', address_1: '', zip_code: ''
        }, {
            type: 1, country_code: null, state_id: null, listType: this.listTypeAddress, listCountry: this.listCountry, listState: [], is_default: false, name: '', address_1: '', zip_code: ''
        }, {
            type: 2, country_code: null, state_id: null, listType: this.listTypeAddress, listCountry: this.listCountry, listState: [], is_default: false, name: '', address_1: '', zip_code: '', route_id: null
        }];
        this.setData();

    }
    updatePayment(type) {
        if (type === '1') {
            this.generalForm.patchValue({ payment_make: '0' });
        }

    }
    changeCountry(item) {
        item.listCountry.forEach(element => {
            // tslint:disable-next-line:no-unused-expression
            element.cd === item.country_code && (item.country_name = element.name);
        });
        const params = {
            country: item.country_code
        };
        this.itemService.getStateByCountry(params).subscribe(res => {
            try {
                item.listState = res.data;

            } catch (e) {

            }
        });
    }
    changeState(v, item) {
        item.listState.forEach(element => {
            if (element.id === item.state_id) {
                item.state_name = element.name;
            }

        });
        if (item.state_id === 'null') {
            item.state_name = '';
        }
    }
    checkIsMain($event, id) {
        for (let i = 0; i < this.contacts.length; i++) {
            const item = this.contacts[i];
            if (id !== i && item.checked === false) {
                item.is_main = false;
            }
        }
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
        item.listBranch.map(x => {
            if (item.branch_id === x.id) {
                item.full_address = x.address;
            }
        });
    }
    checkIsDefault($event, idx) {
        for (let i = 0; i < this.addresses.length; i++) {
            const item = this.addresses[i];
            if (idx !== i && item.type === this.addresses[idx].type) {
                item.is_default = false;
            }
        }
    }

    dupAddress(type) {
        if (type === 3 || type === 4) {
            const p = this.addresses[0];
            const k = Object.keys(p);
            for (let i = 1; i < this.addresses.length; i++) {
                k.map(key => {
                    return (key !== 'type' && key !== 'listType' && (this.addresses[i][key] = p[key]));
                });
            }
            this.updatePayment(1);
        } else {
            let tmp = {};
            for (let i = 1; i < this.addresses.length; i++) {
                if (this.addresses[i].type === type) {
                    tmp = JSON.parse(JSON.stringify(this.addresses[i]));
                    tmp['is_default'] = false;
                    tmp['address_id'] = undefined;
                    break;
                }
            }
            this.addresses.push(tmp);
        }
        this.checkAddress();
    }

    //  add new row addresses
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
            listBranch: [],
            account_name: '',
            account_no: ''
        });
    }

    removeBankAccount(index) {
        this.bank_accounts.splice(index, 1);
    }
    //  add new row bank card
    addNewBankCard() {
        this.bank_card.push({
            listCardType: []
        });
    }

    removeBankCard(index) {
        this.bank_card.splice(index, 1);
    }
    //  add new row contacts
    addNewContact() {
        this.contacts.push({
            name: ''
        });
    }

    removeContact(index) {
        this.contacts.splice(index, 1);
    }


    applyData() {
        this.contacts.forEach(obj => {
            obj['pwd_cfrm'] = obj.password;
        });
        if (this.generalForm.value.site_code === '') {
            return this.toastr.error('Site Code is required');
        }
        if (this.generalForm.value.site_name === '') {
            return this.toastr.error('Site Name is required');
        }
        if (this.generalForm.value.payment_make === '' || this.generalForm.value.payment_make === null) {
            return this.toastr.error('Payment Made By is required');
        }
        if (this.generalForm.valid) {
            const params = { ...this.generalForm.value };
            params['contacts'] = this.contacts;
            params['addresses'] = this.addresses;
            params['bank_accounts'] = this.bank_accounts;
            params['credit_cards'] = this.credit_cards;
            // params['user'] = [];
            // if (this.contacts.length > 0) {
            //     params['user'] = this.contacts;

            // }
            // params['banks'] = [];
            // if (this.bank_accounts.length > 0) {
            //     params['banks'] = this.bank_accounts;

            // }
            // params['primary'] = [];
            // params['billing'] = [];
            // params['shipping'] = [];

            // this.addresses.forEach(obj => {
            //     if (obj.type === 1) {
            //         params['primary'].push(obj);
            //     }
            //     if (obj.type === 2) {
            //         params['billing'].push(obj);
            //     }
            //     if (obj.type === 3) {
            //         params['shipping'].push(obj);
            //     }
            // });
            // this.checkValidField(params);
            // (async () => {
            //     await this.checkValidField(params);
            //     await this.closeModal(params);
            // })();
            if (params['contacts'].length > 0) {
                const result = params['contacts'].filter(item => item.is_main === true || item.is_main === 1);
                console.log('result ', result);
                if (result.length === 0) {
                    return this.toastr.error('Please choose at least one main contact for the customer company.');
                }
            }
            console.log('checki: ', params);
            if (this.isEdit === false) {
                delete params.site_id;
            }
            if (this.index !== undefined) {
                // tslint:disable-next-line:object-literal-shorthand
                this.closeModal({ params: params, index: this.index});
            } else {
                this.closeModal(params);
            }


        }

    }
    checkValidField(formData) {
        (async () => {
            let isInvalid = false;
            await formData['contacts'].some((item, index) => {
                if (item.name === '') {
                    isInvalid = true;
                    return this.toastr.error('Contact ' + (index + 1) + ': Name is required');
                }
            });
             await formData['addresses'].some((item, index) => {
                if (item.name === '') {
                    isInvalid = true;
                    return this.toastr.error('Address ' + (index + 1) + ': Name is required');
                }
                if (item.country_code === 'null') {
                    isInvalid = true;
                    return this.toastr.error('Address ' + (index + 1) + ': Country is required');
                }
                if (item.address_1 === '') {
                    isInvalid = true;
                    return this.toastr.error('Address ' + (index + 1) + ': Address 1 is required');
                }
                if (item.city === '') {
                    isInvalid = true;
                    return this.toastr.error('Address ' + (index + 1) + ': City is required');
                }
                if (item.zip_code === '') {
                    isInvalid = true;
                    return this.toastr.error('Address ' + (index + 1) + ': Zip Code is required');
                }
                if (item.state_id == null || item.state_id === 'null') {
                    isInvalid = true;
                    return this.toastr.error('Address ' + (index + 1) + ': State is required');
                }
                if ((item.route_id == null || item.route_id === 'null') && item.type === 2) {
                    isInvalid = true;
                    return this.toastr.error('Contact ' + (index + 1) + ': Route is required');
                }
            });
             await formData['bank_accounts'].some((item, index) => {
                if (item.bank_id == null || item.bank_id === 'null') {
                    isInvalid = true;
                    return this.toastr.error('Bank Account ' + (index + 1) + ': Bank Name is required');
                }
                if (item.branch_id == null || item.branch_id === 'null') {
                    isInvalid = true;
                    return this.toastr.error('Bank Account ' + (index + 1) + ': Branch is required');
                }
                if (item.account_name === '') {
                    isInvalid = true;
                    return this.toastr.error('Bank Account ' + (index + 1) + ': Account Name is required');
                }
                if (item.account_no === '') {
                    isInvalid = true;
                    return this.toastr.error('Bank Account ' + (index + 1) + ': Account No is required');
                }
            });
             await formData['credit_cards'].some((item, index) => {
                if (item.type == null || item.type === 'null') {
                    isInvalid = true;
                    return this.toastr.error('CREDIT CARD ' + (index + 1) + ': Type is required');
                }
                if (item.name === '') {
                    isInvalid = true;
                    return this.toastr.error('CREDIT CARD ' + (index + 1) + ': Card Name is required');
                }
                if (item.no === '') {
                    isInvalid = true;
                    return this.toastr.error('CREDIT CARD ' + (index + 1) + ': Card Number is required');
                }
                if (item.expiration_month === '') {
                    isInvalid = true;
                    return this.toastr.error('CREDIT CARD ' + (index + 1) + ': Expiration Month is required');
                }
                if (item.expiration_year === '') {
                    isInvalid = true;
                    return this.toastr.error('CREDIT CARD ' + (index + 1) + ': Expiration Year is required');
                }
            });
            if (isInvalid === false) {
                return this.closeModal(formData);
            }
        })();
    }
    removeCreditCard(index) {
        if (this.credit_cards[index].hasOwnProperty('id')) {
            this.credit_cards[index].is_deleted = true;
            return;
        }
        this.credit_cards.splice(index, 1);
    }
    addNewCreditCard() {
        this.credit_cards.push({
            'type': null,
            'no': '',
            'name': '',
            'expiration_month': '',
            'expiration_year': '',
            'cvv': null,
            listCard: this.getListCreditCard
        });
    }
    closeModal(data) {
        this.activeModal.close(data);
    }

    closeX() {
        const data = {};
        this.activeModal.close(data);
    }

    changePayment(e) {
        const val = e.target.value;
        let flag = !1;
        if (val * 1 === 1) {
            for (let i = 0; i < this.addresses.length; i++) {
                console.log(this.addresses[i]);
                if (this.addresses[i].type === 1) {
                    // tslint:disable-next-line:prefer-for-of
                    for (let j = 0; j < this.paddr.length; j++) {
                        if (this.paddr[j].type === 1 && this.paddr[j].is_default) {
                            const id = this.addresses[i].address_id;
                                if (this.addresses[i].address_id) {
                                    this.paddr[j].address_id = this.addresses[i].address_id;
                                } else {
                                    delete this.paddr[j].address_id;
                                }
                            this.addresses[i] = JSON.parse(JSON.stringify({...this.paddr[j], id}));
                            flag = !0;
                        }
                    }
                    if (!flag) {
                        // tslint:disable-next-line:prefer-for-of
                        for (let j = 0; j < this.paddr.length; j++) {
                            if (this.paddr[j].type === 1) {
                                if (this.addresses[i].address_id) {
                                    this.paddr[j].address_id = this.addresses[i].address_id;
                                } else {
                                    delete this.paddr[j].address_id;
                                }
                                this.addresses[i] = JSON.parse(JSON.stringify(this.paddr[j]));
                                break;
                            }
                        }
                    }
                }
            }
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
    //#endregion Old Code

    initKeyBoard() {
        this.data['key_config'] = {
            code: {
                element: null,
                focus: true,
            }
        };

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+backspace', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            this.closeX();
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Back'));
        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+f1', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            (document.activeElement as HTMLElement).blur();
            if (this.data['key_config'].code.element) {
                this.data['key_config'].code.element.nativeElement.focus();
            }
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Focus'));

        //#region Address Table
        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+1', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            (document.activeElement as HTMLInputElement).blur();
            if (this.addresses.length) {
                if (!this.flagAddress) {
                    this.flagAddress = true;
                    setTimeout( () => {
                        this.flagContact = false;
                        this.selectAddressTable();
                    }, 0);
                } else {
                    this.flagContact = false;
                    this.selectAddressTable();
                }
            }
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Select Address Table'));

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+2', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            (document.activeElement as HTMLInputElement).blur();
            this.flagAddress = !this.flagAddress;
            if (this.flagAddress) {
                this.flagContact = false;
            }
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Expand/Collapse Address Table'));

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+3', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            (document.activeElement as HTMLInputElement).blur();
            if (this.flagAddress) {
                this.addNewAddress();
            }
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Add new Line Address Table'));
        //#endregion Address Table

        //#region Contact Table
        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+7', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            (document.activeElement as HTMLInputElement).blur();
            if (this.contacts.length) {
                if (!this.flagContact) {
                    this.flagContact = true;
                    setTimeout( () => {
                        this.flagAddress = false;
                        this.selectContactTable();
                    }, 0);
                } else {
                    this.flagAddress = false;
                    this.selectContactTable();
                }
            }
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Select Contact Table'));

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+8', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            (document.activeElement as HTMLInputElement).blur();
            this.flagContact = !this.flagContact;
            if (this.flagContact) {
                this.flagAddress = false;
            }
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Expand/Collapse Contact Table'));

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+9', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            (document.activeElement as HTMLInputElement).blur();
            if (this.flagContact) {
                this.addNewContact();
            }
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Add new Line Contact Table'));
        //#endregion Contact Table

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+o', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            (document.activeElement as HTMLElement).blur();
            this.applyData();
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'OK'));
    }

    resetKeys() {
        const keys = Array.from(this._hotkeysService.hotkeys);
        keys.map(key => {
            this._hotkeysService.remove(key);
        });
    }

    selectAddressTable() {
        this.selectedAddressIndex = 0;
        this.addressTableModal.nativeElement.querySelector('td a').focus();
    }

    selectContactTable() {
        this.selectedContactIndex = 0;
        this.contactTableModal.nativeElement.querySelector('td a').focus();
    }
}
