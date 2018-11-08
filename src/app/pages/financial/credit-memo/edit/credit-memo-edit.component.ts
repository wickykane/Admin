import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, Renderer, ViewChild, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateParserFormatter, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectComponent } from '@ng-select/ng-select';

import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs/Subject';
import { routerTransition } from '../../../../router.animations';

import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { NgbDateCustomParserFormatter } from '../../../../shared/helper/dateformat';
import { OrderHistoryModalContent } from '../../../../shared/modals/order-history.modal';
import { CreditItemMiscModalContent } from '../modals/item-misc/item-misc.modal';
import { CreditItemModalContent } from '../modals/item/item.modal';
import { CreditMemoEditKeyService } from './keys.edit.control';

import { HotkeysService } from 'angular2-hotkeys';
import * as _ from 'lodash';
import { ConfirmModalContent } from '../../../../shared/modals/confirm.modal';
import { OrderService } from '../../../order-mgmt/order-mgmt.service';
import { FinancialService } from '../../financial.service';
import { CreditMemoService } from './../credit-memo.service';

import { cdArrowTable } from '../../../../shared';
import { ROUTE_PERMISSION } from '../../../../services/route-permission.config';
@Component({
    selector: 'app-edit-credit-memo',
    templateUrl: './credit-memo-edit.component.html',
    styleUrls: ['../credit-memo.component.scss'],
    providers: [OrderService, HotkeysService, CreditMemoEditKeyService, { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }],
    animations: [routerTransition()],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class CreditMemoEditComponent implements OnInit {
    /**
     * Variable Declaration
     */
    @ViewChild(cdArrowTable) table: cdArrowTable;

    public generalForm: FormGroup;
    public listMaster = {};
    public selectedIndex = 0;
    public data = {};
    public clone_items = [];
    public items_removed = [];
    public firstChanged = false;
    public currentDate;

    public messageConfig = {
        '2': 'Are you sure that you want to save & submit the credit memo to approver?',
        '3': 'Are you sure that you want to Save & Validate the credit memo?',
        'default': 'The data you have entered may not be saved, are you sure that you want to leave?',
    };

    public customer: any = {
        'last_sales_order': '',
        'current_dept': '',
        'discount_level': '',
        'items_in_quote': '',
        'buyer_type': '',
        primary: [],
        billing: [],
        shipping: [],
        contact: []
    };

    public addr_select: any = {
        shipping: {},
        billing: {},
        contact: {}
    };

    public order_info: any = {
        total: 0,
        order_summary: {},
        sub_total: 0,
        order_date: '',
        customer_po: '',
        total_discount: 0,
        company_id: null,
        selected_programs: [],
        discount_percent: 0,
        vat_percent: 0,
        shipping_cost: 0
    };

    public list = {
        items: [],
        backItems: []
    };
    accountList: any;

    public searchKey = new Subject<any>(); // Lazy load filter

    public isInstallQuickbook = false;
    /**
     * Init Data
     */
    constructor(
        private vRef: ViewContainerRef,
        private cd: ChangeDetectorRef,
        private fb: FormBuilder,
        public toastr: ToastrService,
        private router: Router,
        private route: ActivatedRoute,
        private modalService: NgbModal,
        private orderService: OrderService,
        private _hotkeysService: HotkeysService,
        public keyService: CreditMemoEditKeyService,
        private creditMemoService: CreditMemoService,
        private financialService: FinancialService,
        private dt: DatePipe) {
        this.generalForm = fb.group({
            'cd': [null],
            'approver_id': [null, Validators.required],
            'company_id': [null, Validators.required],
            'carrier_id': [null], // Default Ups
            'ship_rate': [null],
            'ship_method_option': [null],
            'contact_user_id': [null],
            'sale_person_id': [null, Validators.required],
            'payment_method_id': [null, Validators.required],
            'payment_term_id': [null, Validators.required],
            'billing_id': [null],
            'shipping_id': [null],
            'description': [null],
            'document_type': [1, Validators.required],
            'gl_account': [null, Validators.required],
            'issue_date': [null, Validators.required],
            'document_id': [null, Validators.required],
        });
        //  Init Key
        this.keyService.watchContext.next({ context: this, service: this._hotkeysService });
    }

    async ngOnInit() {
        this.data['id'] = this.route.snapshot.paramMap.get('id');
        const user = JSON.parse(localStorage.getItem('currentUser'));

        // List Master
        this.orderService.getOrderReference().subscribe(res => { Object.assign(this.listMaster, res.data); });
        this.getQuickbookSettings();
        await this.getListPaymentMethod();
        await this.getListPaymentTerm();
        await this.getListAccountGL();
        this.getGenerateCode();

        //  Item
        this.list.items = [];
        const currentDt = new Date();

        // Init Date
        this.generalForm.controls['issue_date'].patchValue(currentDt.toISOString().slice(0, 10));
        this.currentDate = (new Date()).toISOString().slice(0, 10);

        // Lazy Load filter
        this.data['page'] = 1;
        const params = { page: this.data['page'], length: 100 };
        this.orderService.getAllCustomer(params).subscribe(res => {
            this.listMaster['customer'] = res.data.rows;
            this.data['total_page'] = res.data.total_page;
            this.refresh();
        });
        this.searchKey.debounceTime(300).subscribe(key => {
            this.data['page'] = 1;
            this.searchCustomer(key);
        });
        this.getDetailCreditMemo();
        this.updateTotal();
    }
    getListApprover() {
        const params = {
            permissions: ROUTE_PERMISSION['credit-memo'].approve,
        };
        this.financialService.getListApprover(params).subscribe(res => {
            this.listMaster['approver'] = res.data;
            const defaultValue = (this.listMaster['approver'].find(item => item.id === this.generalForm.value.approver_id) || {}).id || null;
            this.generalForm.patchValue({ approver_id: defaultValue });
        });
    }
    /**
     * Mater Data
     */
    refresh() {
         if (!this.cd['destroyed']) { this.cd.detectChanges(); }
    }

    selectTable() {
        this.selectedIndex = 0;
        this.table.scrollToTable();
        setTimeout(() => {
            const button = this.table.element.nativeElement.querySelectorAll('td button');
            if (button && button[this.selectedIndex]) {
                button[this.selectedIndex].focus();
            }
        });
        this.refresh();
    }

    getQuickbookSettings() {
        this.financialService.getSettingInfoQuickbook().subscribe(
            res => {
                this.isInstallQuickbook = res.data.state === 'authorized' ? true : false;
            }, err => {}
        );
    }

    getListPaymentMethod() {
        return new Promise(resolve => {
            this.creditMemoService.getPaymentMethod().subscribe(res => {
                this.listMaster['payment_method'] = res.data;
                resolve(true);
            });
        });
    }

    getListPaymentTerm() {
        return new Promise(resolve => {
            this.creditMemoService.getListPaymentTerm().subscribe(res => {
                this.listMaster['payment_term'] = res.data;
                resolve(true);
            });
        });
    }

    getListAccountGL() {
        return new Promise(resolve => {
            this.creditMemoService.getListAccountGL().subscribe(res => {
                const accountList = res['data'];
                const tempAccountList = [];
                accountList.forEach(item => {
                    tempAccountList.push({ 'name': item.name, 'level': item.level, 'disabled': true }, ...item.children);
                });
                this.accountList = tempAccountList;
                resolve(true);
            });
        });
    }

    getGenerateCode() {
        this.creditMemoService.getGenerateCode().subscribe(res => {
            this.listMaster['documentType'] = res.data.document_type;
            this.refresh();
        });
    }

    getDetailCreditMemo() {
        this.creditMemoService.getDetailCreditMemo(this.data['id']).subscribe(res => {
            try {
                const data = res.data;
                this.generalForm.patchValue(data);
                this.list.items = data.items || [];
                this.changeCustomer(1);
                if (data.document_type === 2) {
                    this.generalForm.get('payment_method_id').disable(); // Disable If Store Credit
                    this.generalForm.get('payment_term_id').disable();
                }
                this.getListApprover();
                // Lazy Load filter
                const params = { page: this.data['page'], length: 100 };
                this.orderService.getAllCustomer(params).subscribe(result => {
                    const idList = result.data.rows.map(item => item.id);
                    this.listMaster['customer'] = result.data.rows;
                    if (res.data.buyer_id && idList.indexOf(res.data.buyer_id) === -1) {
                        this.listMaster['customer'].push({ id: res.data.buyer_id, company_name: res.data.buyer_name , name: res.data.buyer_name});
                    }
                    this.data['total_page'] = result.data.total_page;
                    this.refresh();
                });
            } catch (e) {
                console.log(e);
            }
        });
    }


    getDetailCustomerById(company_id, flag?) {
        this.orderService.getDetailCompany(company_id).subscribe(res => {
            try {
                this.customer = res.data;
                const idList = (this.listMaster['customer'] || []).map(item => item.id);
                if (res.data.company_id && idList.indexOf(res.data.company_id) === -1) {
                    this.listMaster['customer'] = [...this.listMaster['customer'], { id: res.data.company_id, company_name: res.data.company_name ,   name: res.data.company_name }];
                }

                if (res.data.buyer_type === 'PS' && res.data.contact[0]) {
                    this.addr_select.contact = res.data.contact[0];
                    this.generalForm.patchValue({ contact_user_id: res.data.contact[0]['id'] });
                }
                if (flag) {
                    this.selectAddress('billing', flag);
                    this.selectAddress('shipping', flag);
                }
                this.selectContact();
                this.refresh();
            } catch (e) {
                console.log(e);
            }
        });
        this.getListDocument(flag);
    }

    getListDocument(flag?) {
        if (!this.generalForm.value.company_id || !this.generalForm.value.document_type) {
            return;
        }

        if (!flag) {
            this.resetDataChange();
        }
        const params = {
            cus_id: this.generalForm.value.company_id,
            doc_type: this.generalForm.value.document_type
        };

        this.creditMemoService.getListDocument(params).subscribe(res => {
            this.listMaster['invoice-list'] = res.data;
            this.changeInvoice(flag);
            this.refresh();
        });

        this.generalForm.get('payment_method_id').enable();
        this.generalForm.get('payment_term_id').enable();

        if (this.generalForm.value.document_type === 2 && !flag) {
            this.setDefaulValueRMA();
        }

    }

    /**
     * Internal Function
     */
    resetDataChange() {
        this.generalForm.patchValue({
            document_id: null,
            payment_term_id: null,
            payment_method_id: null,
            gl_account: null,
            billing_id: null,
        });
        this.list.items = [];
        this.data['shipping_address'] = {};
        this.data['order_detail'] = {};
        this.addr_select.billing = {};
        this.data['shipping_method'] = {};
        this.refresh();
    }

    setDefaulValueRMA() {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        const default_payment = (this.listMaster['payment_method'].find(item => item.cd === 'SC') || {}).id;
        this.generalForm.get('payment_method_id').disable();
        this.generalForm.get('payment_term_id').disable();
        this.generalForm.patchValue({
            payment_method_id: default_payment,
            payment_term_id: 1,
            gl_account: 162,
            approver_id: user.id,
            sale_person_id: user.id,
        });
        this.refresh();
    }

    selectData(data) { }

    changeInvoice(flag?) {
        const params = {
            id: this.generalForm.value.document_id,
            doc_type: this.generalForm.value.document_type
        };
        if (this.generalForm.value.document_id !== null) {
            this.creditMemoService.getDetailDocument(params).subscribe(res => {
                if (this.firstChanged) {
                    this.list.items = res.data.inv_detail.map(item => {
                        item.quantity = item.qty_inv || item.accept_qty || 0;
                        if (!item.is_item) { item.sku = item.misc_no; }
                        return item;
                    });
                }
                this.firstChanged = true;
                this.data['order_detail'] = res.data;
                this.data['shipping_address'] = res.data.shipping_address;
                this.data['shipping_method'] = res.data.shipping_method;
                if (!flag) {
                    this.generalForm.patchValue({
                        ...this.data['order_detail'], approver_id: res.data.approver_id || res.data.aprvr_id
                    });
                }
                this.selectAddress('billing');
                this.updateTotal();
            });
        } else {
            this.firstChanged = true;
        }
    }

    changeCustomer(flag?) {
        const company_id = this.generalForm.value.company_id;
        if (company_id) {
            this.getDetailCustomerById(company_id, flag);
        }

        if (!flag) {
            this.list.items = [];
            this.updateTotal();
        }
        this.refresh();
    }

    selectAddress(type, flag?) {
        try {
            switch (type) {
                case 'shipping':
                    const ship_id = this.generalForm.value.shipping_id;
                    if (ship_id) {
                        this.addr_select.shipping = this.findDataById(ship_id, this.customer.shipping);
                    }
                    break;
                case 'billing':
                    const billing_id = this.generalForm.value.billing_id;
                    if (billing_id) {
                        this.addr_select.billing = this.findDataById(billing_id, this.customer.billing);
                    }
                    break;
            }
            this.refresh();
        } catch (e) {
            console.log(e);
        }
    }

    findDataById(id, arr) {
        const item = arr.filter(x => x.address_id === id);
        return item[0] || {};
    }

    selectContact() {
        const id = this.generalForm.value.contact_user_id;
        if (id) {
            const temp = this.customer.contact.filter(x => x.id === id);
            this.addr_select.contact = temp[0] || {};
        }
        this.refresh();
    }


    updateTotal() {
        this.order_info.total = 0;
        this.order_info.sub_total = 0;
        this.order_info.restocking_fee = 0;
        const items = this.list.items.filter(i => !i.misc_id);
        this.groupTax(this.list.items);
        this.order_info.order_summary = {};
        this.order_info.order_summary['total_item'] = items.length;
        items.forEach(item => {
            this.order_info.order_summary['total_cogs'] = (this.order_info.order_summary['total_cogs'] || 0) + (+item.cost_price || 0) * (item.quantity || 0);
            this.order_info.order_summary['total_vol'] = (this.order_info.order_summary['total_vol'] || 0) + (+item.vol || 0) * (item.quantity || 0);
            this.order_info.order_summary['total_weight'] = (this.order_info.order_summary['total_weight'] || 0) + (+item.wt || 0) * (item.quantity || 0);
        });


        this.list.items.forEach(item => {
            item.amount = (+item.quantity * (+item.price || 0)) * (100 - (+item.discount_percent || 0)) / 100;
            if (item.misc_id && item.misc_id === 6) {
                this.order_info.restocking_fee = item.amount || 0;
                return;
            }
            this.order_info.sub_total += item.amount;
        });
        this.data['remain'] = this.order_info.sub_total;
        this.order_info.sub_total -= this.order_info.restocking_fee;
        this.order_info.total = +this.order_info['total_tax'] + +this.order_info.sub_total;
        this.refresh();
    }

    deleteAction(id, item_condition) {
        this.list.items = this.list.items.filter((item) => {
            if (item.item_id === id && item.is_item === 1) {
                this.items_removed.push(item.item_id);
                console.log(this.items_removed);
            }
            return ((item.item_id || item.misc_id) + (item.item_condition_id || 'mis') !== (id + (item_condition || 'mis')));
        });
        this.updateTotal();
    }

    groupTax(items) {
        this.order_info['taxs'] = [];
        this.order_info['total_tax'] = 0;
        const taxs = items.map(item => item.tax_percent || 0);
        const unique = taxs.filter((i, index) => taxs.indexOf(i) === index);
        unique.forEach((tax, index) => {
            let taxAmount = 0;
            items.filter(item => item.tax_percent === tax).map(i => {
                taxAmount += (+i.tax_percent * +i.quantity * (+i.price || 0) / 100);
            });
            this.order_info['total_tax'] = this.order_info['total_tax'] + +(taxAmount.toFixed(2));
            this.order_info['taxs'].push({
                value: tax, amount: taxAmount.toFixed(2)
            });
        });
        this.refresh();
    }
    addNewItem() {
        if (this.items_removed.length === 0) {
            return;
        }
        this.keyService.saveKeys();
        const modalRef = this.modalService.open(CreditItemModalContent, { size: 'lg' });
        modalRef.result.then(res => {
            if (this.keyService.keys.length > 0) {
                this.keyService.reInitKey();
                this.table.reInitKey(this.data['tableKey']);
            }
            if (res instanceof Array && res.length > 0) {
                const listAdded = [];
                (this.list.items).forEach((item) => {
                    listAdded.push(item.sku + item.item_condition_id);
                });
                res.forEach((item) => {
                    if (item.sale_price) { item.sale_price = Number(item.sale_price); }
                    item['products'] = [];
                    item.quantity = 1;
                    item.is_shipping_free = item.is_shipping_free || item.free_ship;
                    item['order_detail_id'] = null;
                    item.totalItem = item.sale_price;
                    item.source_id = 0;
                    item.source_name = 'From Master';
                });
                this.list.items = this.list.items.concat(res.filter((item) => {
                    const idx = this.items_removed.indexOf(item.id);
                    if (idx !== -1) { this.items_removed.splice(idx, 1); }
                    console.log(this.items_removed);
                    if (listAdded.indexOf(item.sku + item.item_condition_id) < 0) {
                        return listAdded.indexOf(item.sku + item.item_condition_id) < 0;
                    } else {
                        this.toastr.error('The item ' + item.no + ' already added in the order');
                    }
                }));

                this.updateTotal();
            }
        }, dismiss => {
            if (this.keyService.keys.length > 0) {
                this.keyService.reInitKey();
                this.table.reInitKey(this.data['tableKey']);
            }
        });
        modalRef.componentInstance.items_removed = { item_id: this.items_removed, document_type: this.generalForm.value.document_type, document_id: this.generalForm.value.document_id };
    }

    addNewMiscItem() {
        this.keyService.saveKeys();
        const modalRef = this.modalService.open(CreditItemMiscModalContent, { size: 'lg' });
        modalRef.result.then(res => {
            if (this.keyService.keys.length > 0) {
                this.keyService.reInitKey();
                this.table.reInitKey(this.data['tableKey']);
            }
            if (this.keyService.keys.length > 0) {
                this.keyService.reInitKey();
                this.table.reInitKey(this.data['tableKey']);
            }
            if (res instanceof Array && res.length > 0) {
                const listAdded = [];
                (this.list.items).forEach((item) => {
                    listAdded.push(item.sku + (item.item_condition_id || 'misc'));
                });

                res.forEach((item) => {
                    if (item.sale_price) { item.sale_price = Number(item.sale_price); }
                    item.source_id = 2;
                    item.source_name = 'Manual';
                    item.quantity = 1;
                    item.is_misc = 1;
                    item.uom_name = item.uom;
                    item.misc_id = item.id;
                    item.sku = item.no;
                });

                this.list.items = this.list.items.concat(res.filter((item) => {
                    if (listAdded.indexOf(item.sku + (item.item_condition_id || 'misc')) < 0) {
                        return listAdded.indexOf(item.sku + (item.item_condition_id || 'misc')) < 0;
                    } else {
                        this.toastr.error('The item ' + item.no + ' already added in the order');
                    }

                }));

                this.updateTotal();
            }
        }, dismiss => {
            if (this.keyService.keys.length > 0) {
                this.keyService.reInitKey();
                this.table.reInitKey(this.data['tableKey']);
            }
        });
    }

    resetInvoice() {
        this.listMaster = {};
        this.data = {};
        this.customer = {
            'last_sales_order': '',
            'current_dept': '',
            'discount_level': '',
            'items_in_quote': '',
            'buyer_type': '',
            primary: [],
            billing: [],
            shipping: [],
            contact: []
        };

        this.addr_select = {
            shipping: {},
            billing: {},
            contact: {}
        };

        this.order_info = {
            total: 0,
            order_summary: {},
            sub_total: 0,
            order_date: '',
            customer_po: '',
            total_discount: 0,
            company_id: null,
            selected_programs: [],
            discount_percent: 0,
            vat_percent: 0,
            shipping_cost: 0
        };

        this.list = {
            items: [],
            backItems: []
        };
        this.ngOnInit();
    }

    createMemo(type, is_draft_sq?) {
        const items = this.list.items.map(item => {
            item.discount_percent = item.discount_percent;
            item.is_item = (item.misc_id) ? 0 : 1;
            return item;
        });

        const params = {
            ...this.generalForm.getRawValue(),
            status: type,
            original_ship_cost: this.order_info['original_ship_cost'],
            items,
            is_draft_sq: is_draft_sq || 0,
            is_copy: this.data['is_copy'] || 0
        };
        this.creditMemoService.updateCredit(this.data['id'], params).subscribe(res => {
            try {
                if (res.status) {
                    this.toastr.success(res.message);
                    this.data['id'] = res.data.id;
                    if ( type === 3 && this.isInstallQuickbook) {
                        this.financialService.syncCreditToQuickbook(this.data['id']).subscribe(
                            _res => {
                                try {
                                    const result = JSON.parse(_res['_body']);
                                    this.toastr.success(`Credit Memo ${result.data[0].entity.DocNumber} has been sync to Quickbooks successfully.`);
                                } catch (err) {}
                            },
                            err => {
                                this.toastr.error(`Cannot sync Credit Memo to Quickbooks.`);
                            }
                        );
                    }
                    setTimeout(() => {
                        this.router.navigate(['/financial/credit-memo/view/' + this.data['id']]);
                    }, 500);

                } else {
                    this.toastr.error(res.message);
                }
            } catch (e) {
                console.log(e);
            }
        });
    }

    confirmModal(type, is_draft_sq?) {
        const modalRef = this.modalService.open(ConfirmModalContent, { size: 'lg', windowClass: 'modal-md' });
        modalRef.result.then(res => {
            if (res) {
                if (type) {
                    this.createMemo(type, is_draft_sq);
                } else {
                    this.router.navigate(['/financial/credit-memo']);
                }
            }
        }, dismiss => { });
        modalRef.componentInstance.message = this.messageConfig[type || 'default'];
        modalRef.componentInstance.yesButtonText = 'Yes';
        modalRef.componentInstance.noButtonText = 'No';
    }

    fetchMoreCustomer(data?) {
        this.data['page']++;
        if (this.data['page'] > this.data['total_page']) {
            return;
        }
        const params = { page: this.data['page'], length: 100 };
        if (this.data['searchKey']) {
            params['company_name'] = this.data['searchKey'];
        }
        this.orderService.getAllCustomer(params).subscribe(res => {
            this.listMaster['customer'] = this.listMaster['customer'].concat(res.data.rows);
            this.data['total_page'] = res.data.total_page;
            this.refresh();
        });
    }

    searchCustomer(key) {
        this.data['searchKey'] = key;
        const params = { page: this.data['page'], length: 100 };
        if (key) {
            params['company_name'] = key;
        }
        this.orderService.getAllCustomer(params).subscribe(res => {
            this.listMaster['customer'] = res.data.rows;
            this.data['total_page'] = res.data.total_page;
            this.refresh();
        });
    }
}
