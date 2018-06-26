import { Component, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '../customer.service';

//  modal
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SiteModalComponent } from '../../../shared/modals/site.modal';


import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { ToastrService } from 'ngx-toastr';
import { routerTransition } from '../../../router.animations';

@Component({
    selector: 'app-customer-edit',
    templateUrl: './customer-edit.component.html',
    styleUrls: ['./customer.component.scss'],
    animations: [routerTransition()]
})
export class CustomerEditComponent implements OnInit, OnDestroy {

    generalForm: FormGroup;

    public address: any = [];
    public bank_account: any = [];
    public bank_card: any = [];
    public contact: any = [];
    public site: any = [];
    public company_child: any = [];

    public listMaster = {};
    public listTypeAddress: any = [];
    public listCountry: any = [];
    public listBank: any = [];

    public flagAddress = true;
    public flagSite: boolean;
    public flagAccount: boolean;
    public flagContact: boolean;
    public routeList = [];

    public users: any = [];
    public listFile: any = [];
    public addressList: any = [];
    public imageSelected: string;
    public idSupplier: string;
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

    hotkeyCtrlLeft: Hotkey | Hotkey[];
    hotkeyCtrlRight: Hotkey | Hotkey[];

    constructor(public fb: FormBuilder,
        public router: Router,
        public toastr: ToastrService,
        private customerService: CustomerService,
        public route: ActivatedRoute,
        private modalService: NgbModal,
        private hotkeysService: HotkeysService) {
        this.generalForm = fb.group({
            'buyer_type': [null, Validators.required],
            'code': [null],
            'full_name': [null],
            'registration': [null],
            'phone': [null],
            'fax': [null],
            'email': [null],
            'line_of_credit': [null],
            'credit_sts': 2,
            'sale_man_id': 1,
            'first_name': [null],
            'last_name': [null],
            'username': [null],
            'pwd': [null],
            'pwd_cfrm': [null],
            'primary': [null],
            'credit_used': [null],
            'credit_limit': [null],
            'credit_balance': [null]

        });

        this.hotkeyCtrlRight = hotkeysService.add(new Hotkey('alt+r', (event: KeyboardEvent): boolean => {
            this.flagAddress = true;
            return false; //  Prevent bubbling
        }));


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
        this.customerService.getRoute().subscribe(res => { this.routeList = res.data; });
    }
    getDetailSupplier(id) {
        this.idSupplier = id;
        this.customerService.getDetailCustomer(this.idSupplier).subscribe(res => {
            try {
                this.detail = res.data;
                this.generalForm.patchValue(this.detail);
                this.generalForm.patchValue({
                    'buyer_type': this.detail['company_type'],
                });
                this.imageSelected = res.data.img;
                this.site = res.data['sites'];
                for (let i = 0; i < this.site.length; i++) {
                    this.site[i].is_remove = false;
                    this.company_child.push(this.site[i]);
                }
                this.contact = this.detail['user'];
                this.detail['company_type'] === 'CP' && (res.data['primary'] = res.data['head_office']);
                this.changeCustomerType();
                this.getListBank();
                //  this.changeCountry(res.data['primary'][0]['country_code'], 'states_primary');
                //  this.addressList = this.mergeAddressList(res.data);
            } catch (e) {

            }
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
        if (this.generalForm.value.buyer_type === 'CP') {
            const tmp = this.generalForm.value.code.split('-');
            this.countCode = Number(tmp[1]);
            this.textCode = tmp[0] + '-';
            this.generalForm.patchValue(this.detail['head_office'][0]);
            //  this.generalForm.patchValue({primary: this})
        }
        else {
            //  this.generalForm.patchValue(this.detail['primary'][0]);
        }
    }

    getListSalePerson() {
        this.listMaster['salePersons'] = [];
    }

    getListCountryAdmin() {
        this.customerService.getListCountryAdmin().subscribe(res => {
            try {
                this.listCountry = res.data;
            } catch (e) {
                console.log(e);
            }
        });
    }

    getListBank() {
        this.customerService.getListBank().subscribe(res => {
            try {
                this.listBank = res.data;
                this.bank_account = this.detail['banks'];
                for (let i = 0; i < this.bank_account.length; i++) {
                    this.bank_account[i].listBank = this.listBank;
                    this.changeBank(this.bank_account[i]);
                }
            } catch (e) {
                console.log(e);
            }
        });
    }


    //  change customer Type
    changeCustomerType() {
        this.getListTypeAddress();
        const addressConfig = {
            head_office: { type: 4, listType: [{ id: 4, name: 'Head Office' }] },
            primary: { type: 3, listType: [{ id: 3, name: 'Primary' }] },
            billing: { type: 1, listType: this.listTypeAddress },
            shipping: { type: 2, listType: this.listTypeAddress },
            general: {listCountry: this.listCountry, listState: [], allow_remove: false}
        }

        const primary = this.detail[(this.generalForm.value.buyer_type === 'CP')? 'head_office' : 'primary'].map( item => {
            return { ...item, ...addressConfig[(this.generalForm.value.buyer_type === 'CP')? 'head_office' : 'primary'],  ...addressConfig['general']};
        })
        const billing = this.detail['billing'].map( item => { return { ...item, ...addressConfig['billing'], ...addressConfig['general']}; })
        const shipping = this.detail['shipping'].map( item => { return { ...item, ...addressConfig['shipping'],  ...addressConfig['general']}; })
        
        this.address = [ ...primary, ...billing, ...shipping ];
        this.address.forEach(element => {
            this.changeCountry(element); 
        });
        
        console.log(this.address);
        this.address = [];
        if (this.generalForm.value.buyer_type === 'CP') {
            for (let i = 0; i < this.detail['head_office'].length; i++) {
                const element = this.detail['head_office'][i];
                this.address.push({
                    ...{
                        type: 4, listType: [{ id: 4, name: 'Head Office' }], listCountry: this.listCountry, listState: [], allow_remove: false
                    }, ...element
                });
            }
        } else {
            for (let i = 0; i < this.detail['primary'].length; i++) {
                const element = this.detail['primary'][i];
                this.address.push({
                    ...{
                        type: 3, listType: [{ id: 3, name: 'Primary' }], listCountry: this.listCountry, listState: [], allow_remove: false
                    }, ...element
                });
            }
        }

        for (let i = 0; i < this.detail['billing'].length; i++) {
            const element = this.detail['billing'][i];
            this.address.push({
                ...{
                    type: 1, listType: this.listTypeAddress, listCountry: this.listCountry, listState: [], allow_remove: false
                }, ...element
            });
        }
        for (let i = 0; i < this.detail['shipping'].length; i++) {
            const element = this.detail['shipping'][i];
            this.address.push({
                ...{
                    type: 2, listType: this.listTypeAddress, listCountry: this.listCountry, listState: [], allow_remove: false
                }, ...element
            });
        }
        for (let i = 0; i < this.address.length; i++) {
            this.changeCountry(this.address[i]);
        }
    }

    changeCountry(item) {
        const params = {
            country: item.country_code
        };
        this.customerService.getStateByCountry(params).subscribe(res => {
            try {
                item.listState = res.data;
            } catch (e) {

            }
        });
    }

    changeBank(item) {
        item.bank_swift = this.listBank.map(x => {
            if (item.bank_id === x.id) {
                return x.swift;
            }
        })[0];

        this.customerService.getListBranchByBank(item.bank_id).subscribe(res => {
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
        })[0];
    }

    //  add new row address
    addNewAddress() {
        this.address.push({
            listType: this.listTypeAddress,
            listCountry: this.listCountry,
            listState: [], allow_remove: true
        });
    }

    removeAddress(index) {
        this.address.splice(index, 1);
    }

    //  add new row bank account
    addNewBankAccount() {
        this.bank_account.push({
            listBank: this.listBank,
            listBranch: []
        });
    }

    removeBankAccount(index) {
        if (this.bank_account[index].hasOwnProperty('id')) {
            this.bank_account[index].is_deleted = true;
            return;
        }
        this.bank_account.splice(index, 1);
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
    //  add new row contact
    addNewContact() {
        this.contact.push({});
    }

    removeContact(index) {
        if (this.contact[index].hasOwnProperty('id')) {
            this.contact[index].is_deleted = true;
            return;
        }
        this.contact.splice(index, 1);
    }

    //  add new Site
    isEmptyObject(obj) {
        return (obj && (Object.keys(obj).length === 0));
    }

    addNewSite() {
        const modalRef = this.modalService.open(SiteModalComponent, { size: 'lg' });
        modalRef.result.then(res => {
            console.log(res);
            if (!this.isEmptyObject(res)) {
                const state = this.address[0].listState.filter(x =>
                    res.primary[0].state_id === x.id
                );
                const objSite = {
                    code: res.code,
                    full_name: res.full_name,
                    country: this.address[0].listCountry.map(x => {
                        if (res.primary[0].country_code === x.cd) {
                            return x.name;
                        }
                    }),
                    name: res.primary[0].name,
                    address_line: res.primary[0].address_line,
                    address_line2: res.primary[0].address_line2,
                    city_name: res.primary[0].city_name,
                    state: state[0].name,
                    zip_code: res.primary[0].zip_code
                };

                this.site.push(objSite);
                console.log(res);
                this.company_child.push(res);
                this.countCode++;
            }
        });
        modalRef.componentInstance.info = {
            parent_company_name: this.generalForm.value.full_name,
            code: this.countCode,
            textCode: this.textCode
        };
    }

    removeSite(index) {
        this.site.splice(index, 1);
    }


    updateCustomer() {
        this.contact.forEach(obj => {
            obj['pwd_cfrm'] = obj.pwd;
        });
        //  this.bank_account.forEach(obj => {
        //      delete obj['listBank'];
        //      delete obj['listBranch'];
        //  });
        //  this.address.forEach(obj => {
        //      delete obj['listCountry'];
        //      delete obj['listState'];
        //  });
        if (this.generalForm.valid) {
            const params = Object.assign({}, this.generalForm.value);
            params['user'] = [];
            if (this.contact.length > 0) {
                params['user'] = this.contact;

            }
            params['banks'] = [];
            if (this.bank_account.length > 0) {
                params['banks'] = this.bank_account;

            }
            params['company_child'] = [];
            params['company_child'] = this.company_child;

            params['primary'] = [];
            params['billing'] = [];
            params['shipping'] = [];

            this.address.forEach(obj => {
                if (obj.type === 4 || obj.type === 3) {
                    params['primary'].push(obj);
                }
                if (obj.type === 1) {
                    params['billing'].push(obj);
                }
                if (obj.type === 2) {
                    params['shipping'].push(obj);
                }
            });

            if (this.generalForm.value.buyer_type === 'CP') {
                delete params.first_name;
                delete params.last_name;
                delete params.pwd;
                delete params.pwd_cfrm;
                delete params.username;
                delete params.email;
            } else {
                params.pwd_cfrm = params.pwd;
                //  delete params.full_name;

            }

            const data = {
                data: JSON.stringify(params)
            };

            console.log(params);
            console.log(data);

            this.customerService.updateCustomer(this.idSupplier, data).subscribe(
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
                    this.toastr.error(err.message);
                });
        }

    }

}
