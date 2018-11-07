import { state } from '@angular/animations';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { CustomerService } from '../../customer.service';
import { CustomerEditKeyService } from './keys.control';

//  modal
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SiteModalComponent } from '../../../../shared/modals/site.modal';


import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { ToastrService } from 'ngx-toastr';
import { routerTransition } from '../../../../router.animations';
import { Helper } from '../../../../shared/index';

import { cdArrowTable } from '../../../../shared';
@Component({
    selector: 'app-customer-edit',
    templateUrl: './customer-edit.component.html',
    styleUrls: ['../customer.component.scss'],
    animations: [routerTransition()],
    providers: [CustomerEditKeyService],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerEditComponent implements OnInit, OnDestroy {

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
    // public bank_card: any = [];
    public contacts: any = [];
    public sites: any = [];
    public company_child: any = [];

    public listMaster = {};
    public listTypeAddress: any = [];
    public listCountry: any = [];
    public listBank: any = [];

    public flagAddress = true;
    public flagCreditCard = false;
    public flagSite: boolean;
    public flagAccount: boolean;
    public flagContact: boolean;
    public routeList = [];

    public users: any = [];
    public listFile: any = [];
    public addressList: any = [];
    public imageSelected: string;
    public idCustomer: string;
    public removedList: any = [];
    private primaryAddress = [];
    public ADDRESS_TYPE = {
        3: 'MAIN',
        2: 'SHIPPING',
        1: 'BILLING'
    };
    public countCode: number;
    public textCode: string;
    public detail = {};
    public credit_cards = [];

    hotkeyCtrlLeft: Hotkey | Hotkey[];
    hotkeyCtrlRight: Hotkey | Hotkey[];
    public paymentMethodList: any = [];
    public paymentTermList: any = [];

    private hasDot = false;
    constructor(public fb: FormBuilder,
        public router: Router,
        public toastr: ToastrService,
        private customerService: CustomerService,
        public route: ActivatedRoute,
        private modalService: NgbModal,
        private hotkeysService: HotkeysService,
        public keyService: CustomerEditKeyService,
        private commonService: CommonService,
        public helper: Helper,
        private cd: ChangeDetectorRef) {
        this.generalForm = fb.group({
            'buyer_type': [null, Validators.required],
            'addresses': [null],
            'contacts': [null],
            'code': [null , Validators.required],
            'full_name': [null],
            'registration_no': [null],
            'bank_accounts': [null],
            'credit_cards': [null],
            'phone': [null,  Validators.required],
            'fax': [null],
            'email': [null],
            'credit_limit': [null],
            'credit_sts': 2,
            'sale_person_id': [null],
            'first_name': [null],
            'last_name': [null],
            'username': [null],
            'password': [null],
            'pwd_cfrm': [null],
            'company_name': [null],
            'primary': [null],
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
        this.route.params.subscribe(params => this.getDetailSupplier(params.id));
        this.getListCustomerType();
        this.getListSalePerson();
        this.getListCountryAdmin();
        this.customerService.getRoute().subscribe(res => { this.routeList = res.data; this.refresh(); });
    }
    getListCreditCard() {
        this.customerService.getCreditCard().subscribe(res => {
            this.getListCreditCard = res.data;
            this.credit_cards.forEach(card => { card.listCard = res.data; });
            this.refresh();
        });
    }
    getDetailSupplier(id) {
        this.idCustomer = id;
        this.customerService.getDetailCustomerEdit(this.idCustomer).subscribe(res => {
            try {
                this.detail = res.data;
                this.generalForm.patchValue(this.detail);
                this.sites = res.data['sites'];
                // tslint:disable-next-line:prefer-for-of
                for (let i = 0; i < this.sites.length; i++) {
                    this.orderAddress(this.sites[i].addresses);
                }
                this.addresses = res.data['addresses'];
                this.credit_cards = res.data['credit_cards'];
                /* for (const s of this.sites) {
                    s.is_remove = false;
                    this.company_child.push(s);
                } */
                this.contacts = this.detail['contacts'];
                this.bank_accounts = this.detail['bank_accounts'];
                // tslint:disable-next-line:no-unused-expression
                // this.detail['company_type'] === 'CP' && (res.data['primary'] = res.data['head_office']);
                this.changeCustomerType();
                // this.getListBank();
                // this.getListCreditCard();
                this.getListPaymentTerm();
                this.getListPaymentMethod();
                //  this.changeCountry(res.data['primary'][0]['country_code'], 'states_primary');
                //  this.addressList = this.mergeAddressList(res.data);
                this.refresh();
            } catch (e) {
                console.log(e);
                this.refresh();
            }
        });
    }
    ngOnDestroy() {
        this.hotkeysService.remove(this.hotkeyCtrlLeft);
        this.hotkeysService.remove(this.hotkeyCtrlRight);
    }

    refresh() {
       if (!this.cd['destroyed']) { this.cd.detectChanges(); }
    }
    /**
     * get list master data
     */
    getListCustomerType() {
        this.customerService.getListCustomerType().subscribe(res => {
            try {
                this.listMaster['customerType'] = res.data;
                this.refresh();
            } catch (e) {

            }
        });
    }

    getListTypeAddress() {
        if (this.generalForm.value.buyer_type === 'CP') {
            const tmp = this.generalForm.value.code.split('-');
            this.countCode = Number(tmp[1]);
            this.textCode = tmp[0] + '-';
            this.refresh();
            // this.generalForm.patchValue(this.detail['head_office'][0]);
            //  this.generalForm.patchValue({primary: this})
        }
    }
    getListPaymentTerm() {
        this.customerService.getListPaymentTerm().subscribe(res => {
            this.paymentTermList = res.data;
            this.refresh();
        });
    }
    getListPaymentMethod() {
        this.customerService.getListPaymentMethod().subscribe(res => {
            this.paymentMethodList = res.data;
            this.refresh();
        });
    }
    getListSalePerson() {
        this.commonService.getOrderReference().subscribe(res => {
            try {
                this.listMaster['salePersons'] = res.data.sale_mans;
                this.refresh();
            } catch (e) {
                console.log(e);
            }
        });
    }

    getListCountryAdmin() {
        this.commonService.getListCountry().subscribe(res => {
            try {
                this.listCountry = res.data;
                this.refresh();
            } catch (e) {
                console.log(e);
            }
        });
    }

    getListBank() {
        this.commonService.getAllListBank().subscribe(res => {
            try {
                this.listBank = res.data;
                for (const bank of this.bank_accounts) {
                    bank.listBank = this.listBank;
                    this.changeBank(bank);
                    this.refresh();
                }
            } catch (e) {
                console.log(e);
            }
        });
    }
    getListBankSites(item) {
        this.commonService.getAllListBank().subscribe(res => {
            try {
                const listBank = res.data;
                item.listBank = listBank;
                this.changeBankSites(item, listBank);
                this.refresh();
            } catch (e) {
                console.log(e);
            }
        });
    }

    //  change customer Type
    changeCustomerType() {
        this.getListTypeAddress();
        const addressConfig = {
            /* head_office */4: { type: 4, listType: [{ id: 4, name: 'Head Office' }] },
            /* primary */3: { type: 3, listType: [{ id: 3, name: 'Primary' }] },
            /* billing */1: { type: 1, listType: this.listTypeAddress },
            /* shipping */2: { type: 2, listType: this.listTypeAddress },
            /* general */5: { listCountry: this.listCountry, listState: [], allow_remove: false }
        };
        for (let i = 0; i < this.addresses.length; i++) {
            this.addresses[i] = { ...this.addresses[i], ...addressConfig[this.addresses[i].type], ...addressConfig[5] };
            this.changeCountry(this.addresses[i]);
        }
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.sites.length; i++) {
            for (let j = 0; j < this.sites[i].addresses.length; j++) {
                this.sites[i].addresses[j] = { ...this.sites[i].addresses[j], ...addressConfig[this.sites[i].addresses[j].type], ...addressConfig[5] };
                this.changeCountry(this.sites[i].addresses[j]);
                this.displayCountry(this.sites[i].addresses[j]);
            }
            // for (let j = 0; j < this.sites[i].bank_accounts.length; j++) {
            //     this.getListBankSites(this.sites[i].bank_accounts[j]);
            // }
            // this.orderAddress(this.sites[i].addresses);
        }
        // this.orderAddress(this.addresses);
    }

    isNumberKey(evt) {
        const e = evt || window.event; // for trans-browser compatibility
        const charCode = e.which || e.keyCode;
        if (charCode === 46 && !this.hasDot) { this.hasDot = true; return true; }
        if (charCode > 31 && (charCode < 47 || charCode > 57)) {
            return false;
        }
        if (e.shiftKey) { return false; }
        return true;
    }
    isNumberKeyC(evt) {
        const e = evt || window.event; // for trans-browser compatibility
        const charCode = e.which || e.keyCode;
        // if (charCode == 46 && !this.hasDot) { this.hasDot = true; return true; }
        if (charCode > 31 && (charCode < 47 || charCode > 57)) {
            return false;
        }
        if (e.shiftKey) { return false; }
        return true;
    }
    private orderAddress(address) {
        const tmp = [];
        const arr = [4, 3, 1, 2];
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
    displayCountry(item) {
        this.listCountry.forEach(element => {
            if (item.country_code === element.cd) {
                item.country_name = element.name;
            }
        });
    }
    changeCountry(item) {
        const params = {
            country: item.country_code
        };
        this.commonService.getStateByCountry(params).subscribe(res => {
            try {
                item.listState = res.data;
                res.data.forEach(element => {
                    if (item.state_id === element.id) {
                        item.state_name = element.name;
                    }
                });
                this.refresh();
            } catch (e) {

            }
        });
    }

    changeBank(item) {
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.listBank.length; i++) {
            if (item.bank_id === this.listBank[i].id) {
                item.bank_swift = this.listBank[i].swift;
            }
        }
        this.commonService.getListBranchByBank(item.bank_id).subscribe(res => {
            try {
                item.listBranch = res.data;
                this.changeBranch(item);
                this.refresh();
            } catch (e) {

            }
        });
    }
    changeBankSites(item, listBank) {
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < listBank.length; i++) {
            if (item.bank_id === listBank[i].id) {
                item.bank_swift = listBank[i].swift;
            }
        }
        this.commonService.getListBranchByBank(item.bank_id).subscribe(res => {
            try {
                item.listBranch = res.data;
                this.changeBranchSites(item);
                this.refresh();
            } catch (e) {

            }
        });
    }

    changeBranch(item) {
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < item.listBranch.length; i++) {
            if (item.branch_id === item.listBranch[i].id) {
                item.address = item.listBranch[i].address;
            }
        }
    }
    changeBranchSites(item) {
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < item.listBranch.length; i++) {
            if (item.branch_id === item.listBranch[i].id) {
                item.full_address = item.listBranch[i].address;
            }
        }
    }
    //  add new row address
    addNewAddress() {
        this.addresses.push({
            country_code: null, state_id: null,
            listType: this.listTypeAddress,
            listCountry: this.listCountry,
            listState: [], allow_remove: true
        });
        this.refresh();
    }

    removeAddress(index) {
        this.addresses.splice(index, 1);
        this.refresh();
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
        if (this.bank_accounts[index].hasOwnProperty('id')) {
            this.bank_accounts[index].is_deleted = true;
            return;
        }
        this.bank_accounts.splice(index, 1);
    }
    //  add new row credi
    addNewCreditCard() {
        this.credit_cards.push({
            'type': null,
            'no': '',
            'name': '',
            'cvv': '',
            'expiration_month': null,
            'expiration_year': null,
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
    //  add new row contact
    addNewContact() {
        this.contacts.push({});
        this.refresh();
    }

    removeContact(index) {
        if (this.contacts[index].hasOwnProperty('id')) {
            this.contacts[index].is_deleted = true;
            this.refresh();
            return;
        }
        this.contacts.splice(index, 1);
        this.refresh();
    }

    //  add new Site
    addNewSite(item?, index?) {
        const k = ['name', 'country_code', 'address_1', 'city', 'state_id', 'zip_code'];
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.addresses.length; i++) {
            // tslint:disable-next-line:prefer-for-of
            for (let j = 0; j < k.length; j++) {
                if (!this.addresses[i][k[j]]) {
                    return this.toastr.error('Please full fill all the addresses before creating the site.');
                }
            }
        }
        let countCode;
        let textStringCode;
        this.customerService.generateSiteCode().subscribe(res => {
            try {
                this.keyService.saveKeys();
                countCode = Number(res.data.CP.no);
                textStringCode = res.data.CP.text;
                const modalRef = this.modalService.open(SiteModalComponent, { size: 'lg' });
                modalRef.componentInstance.item = item;
                modalRef.componentInstance.index = index;
                modalRef.componentInstance.paddr = JSON.parse(JSON.stringify(this.addresses));
                modalRef.componentInstance.isEdit = true;
                this.refresh();
                modalRef.result.then(_res => {
                    if (this.keyService.keys.length > 0) {
                        this.keyService.reInitKey();
                        this.table.reInitKey(this.data['tableKey']);
                    }
                    if (_res['index'] !== undefined) {
                        this.sites[_res.index] = _res.params;
                    } else {


                        if (!this.helper.isEmptyObject(_res)) {
                            this.sites.push(_res);
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
                    textCode: textStringCode
                };
            } catch (e) {

            }
        });
    }

    removeSite(index) {
        this.sites.splice(index, 1);
        this.refresh();
    }

    checkIsDefault($event, idx) {
        for (let i = 0; i < this.addresses.length; i++) {
            const item = this.addresses[i];
            if (idx !== i && item.type === this.addresses[idx].type) {
                item.is_default = false;
            }
        }
    }

    updateCustomer() {
        if (this.generalForm.value.buyer_type === 'CP') {
            this.contacts.forEach(obj => {
                obj['password'] = obj.password;
            });
            // tslint:disable-next-line:prefer-for-of
            for (let i = 0; i < this.contacts.length; i++) {
                this.contacts[i]['password'] = this.contacts[i]['password'];
            }
        }
        this.generalForm.patchValue({
            'addresses': this.addresses,
            'contacts': this.contacts,
            'sites': this.sites,
            'bank_accounts': this.bank_accounts,
            'credit_cards': this.credit_cards
        });

        if (this.generalForm.valid) {
            const params = { ...this.generalForm.value };
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
            this.customerService.updateCustomer(this.idCustomer, params).subscribe(
                res => {
                    try {
                        setTimeout(() => {
                            this.router.navigate(['/customer']);
                        }, 2000);
                        this.toastr.success(res.message);
                        this.refresh();
                    } catch (e) {
                        console.log(e);
                    }
                },
                err => {
                    console.log(err);
                    this.toastr.error(err.message);
                });
        }

    }

    selectAddressTable() {
        this.selectedAddressIndex = 0;
        this.addressTable.nativeElement.querySelector('td a').focus();
        this.refresh();
    }

    selectSiteTable() {
        this.selectedSiteIndex = 0;
        this.siteTable.nativeElement.querySelector('td a').focus();
        this.refresh();
    }

    selectContactTable() {
        this.selectedContactIndex = 0;
        this.contactTable.nativeElement.querySelector('td a').focus();
        this.refresh();
    }
}
