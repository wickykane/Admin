import { DatePipe } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, Renderer, ViewChild, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateParserFormatter, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectComponent } from '@ng-select/ng-select';

import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs/Subject';
import { routerTransition } from '../../../../router.animations';

import { HotkeysService } from 'angular2-hotkeys';
import * as _ from 'lodash';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { ROUTE_PERMISSION } from '../../../../services/route-permission.config';
import { StorageService } from '../../../../services/storage.service';
import { NgbDateCustomParserFormatter } from '../../../../shared/helper/dateformat';
import { cdArrowTable } from '../../../../shared/index';
import { ConfirmModalContent } from '../../../../shared/modals/confirm.modal';
import { ItemModalContent } from '../../../../shared/modals/item.modal';
import { OrderHistoryModalContent } from '../../../../shared/modals/order-history.modal';
import { PromotionModalContent } from '../../../../shared/modals/promotion.modal';
import { OrderService } from '../../../order-mgmt/order-mgmt.service';
import { ItemMiscModalContent } from './../../../../shared/modals/item-misc.modal';
import { FinancialService } from './../../financial.service';
import { InvoiceEditKeyService } from './keys.edit.control';


@Component({
    selector: 'app-edit-invoice',
    templateUrl: './invoice.edit.component.html',
    styleUrls: ['../invoice.component.scss'],
    providers: [OrderService, HotkeysService, InvoiceEditKeyService, { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }],
    animations: [routerTransition()],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class InvoiceEditComponent implements OnInit, AfterViewInit {
    /**
     * Variable Declaration
     */

    public generalForm: FormGroup;
    public listMaster = {};
    public selectedIndex = 0;
    public data = {};
    public currentDt: string;

    public messageConfig = {
        '2': 'Are you sure that you want to save & submit this invoice to approver? ',
        '4': 'Are you sure that you want to validate this invoice?',
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

    public isInstallQuickbook = false;
    public currentBuyerId = null;

    public searchKey = new Subject<any>(); // Lazy load filter

    /**
     * Init Data
     */
    @ViewChild(cdArrowTable) table: cdArrowTable;
    @ViewChild('invCustomer') invCustomerSelect: NgSelectComponent;
    constructor(
        private vRef: ViewContainerRef,
        private fb: FormBuilder,
        public toastr: ToastrService,
        private router: Router,
        private route: ActivatedRoute,
        private modalService: NgbModal,
        private orderService: OrderService,
        private _hotkeysService: HotkeysService,
        public keyService: InvoiceEditKeyService,
        private financialService: FinancialService,
        private cd: ChangeDetectorRef,
        private storage: StorageService,
        private dt: DatePipe) {
        this.generalForm = fb.group({
            'approver_id': [null, Validators.required],
            'company_id': [null, Validators.required],
            'carrier_id': [null], // Default Ups
            'ship_rate': [null],
            'ship_method_option': [null],
            'warehouse_id': [null],
            'contact_user_id': [null],

            'sales_person': [null],
            'payment_method_id': [null, Validators.required],
            'payment_term_id': [null, Validators.required],
            'billing_id': [null],
            'shipping_id': [null],
            'note': [null],
            'apply_late_fee': [null],
            'due_dt': [null, Validators.required],
            'payment_term_range': [null],

            // Invoice
            'inv_dt': [null, Validators.required],
            'inv_num': [null, Validators.required],
            'order_id': [null, Validators.required],
        });
        //  Init Key
        this.keyService.watchContext.next({ context: this, service: this._hotkeysService });
    }

    async ngOnInit() {
        this.data['id'] = this.route.snapshot.paramMap.get('id');
        const user = JSON.parse(localStorage.getItem('currentUser'));
        this.listMaster['permission'] = this.storage.getRoutePermission(this.router.url);
        // List Master
        this.getQuickbookSettings();
        this.orderService.getOrderReference().subscribe(res => { Object.assign(this.listMaster, res.data); this.refresh(); });
        await this.getListPaymentMethod();
        await this.getListPaymentTerm();

        this.listMaster['yes_no_options'] = [{ value: 0, label: 'No' }, { value: 1, label: 'Yes' }];

        //  Item
        this.list.items = [];
        const currentDt = new Date();

        // Init Date
        this.generalForm.controls['inv_dt'].patchValue(currentDt.toISOString().slice(0, 10));
        this.currentDt = currentDt.toISOString().slice(0, 10);

        // Invoice
        this.generalForm.controls['inv_dt'].valueChanges.debounceTime(300).subscribe(data => {
            if (!this.generalForm.value['payment_term_id']) { return; }
            this.generalForm.controls['payment_term_range'].setValue(this.getPaymentTermRange(this.generalForm.value['payment_term_id']));
            this.getInvoiceDueDate(this.generalForm.value['payment_term_range']);
            this.getEarlyPaymentValue();
            this.refresh();
        });

        // Lazy Load filter
        this.data['page'] = 1;
        const params = { page: this.data['page'], length: 100, buyer_id: this.currentBuyerId };
        Object.keys(params).forEach((key) => (params[key] === null || params[key] === '') && delete params[key]);
        this.orderService.getAllCustomer(params).subscribe(res => {
            this.listMaster['customer'] = res.data.rows;
            this.data['total_page'] = res.data.total_page;
            this.refresh();
        });
        this.searchKey.debounceTime(300).subscribe(key => {
            this.data['page'] = 1;
            this.searchCustomer(key);
        });

        this.getDetailInvoice();
        this.getListApprover();
        this.refresh();
    }

    ngAfterViewInit() {
        this.invCustomerSelect.focus();
    }

    /**
     * Mater Data
     */
    refresh() {
        if (!this.cd['destroyed']) { this.cd.detectChanges(); }
    }
    getListApprover() {
        const params = {
            permissions: ROUTE_PERMISSION['invoice'].approve,
        };
        this.financialService.getListApprover(params).subscribe(res => {
            this.listMaster['approver'] = res.data;
            const defaultValue = (this.listMaster['approver'].find(item => item.id === this.generalForm.value.approver_id) || {}).id || null;
            this.generalForm.patchValue({ approver_id: defaultValue });
        });
    }
    resetChangeData() {
        this.list.items = [];
        const oldForm = this.generalForm.value;
        this.generalForm.reset();
        this.generalForm.patchValue({
            inv_dt: oldForm.inv_dt,
            inv_num: oldForm.inv_num,
            company_id: oldForm.company_id,
        });

        this.addr_select = {
            shipping: {},
            billing: {},
            contact: {}
        };
        this.data['order_detail'] = {};
        this.data['shipping_method'] = {};
        this.data['shipping_address'] = {};
        this.data['is_fixed_early'] = null;
        this.order_info = {};
        this.updateTotal();
    }

    getDefaultNote() {
        if (!this.customer.apply_late_fee || !this.generalForm.value.apply_late_fee || !this.generalForm.value.due_dt || !this.generalForm.value.company_id) {
            return;
        }
        const params = {
            due_dt: this.generalForm.value.due_dt,
            company_id: this.generalForm.value.company_id
        };
        this.financialService.getNote(params).subscribe(res => {
            this.generalForm.patchValue({ note: res.data.message });
            this.refresh();
        });
    }

    getDetailInvoice() {
        this.financialService.getDetailInvoice(this.data['id']).subscribe(res => {
            try {
                const data = res.data;
                this.data['invoice'] = data;
                this.data['shipping_address'] = data['shipping_address'];

                this.data['order_detail'] = {};
                this.data['order_detail'].sale_person_name = data.sale_person_name;
                this.data['order_detail'].warehouse_name = data.warehouse_name;
                this.data['order_detail'].carrier_name = data['shipping_method'].carrier_name;
                this.data['order_detail'].shipping_method_option_name = data['shipping_method'].options_name;
                this.data['order_detail'].shipping_method_rate_name = data['shipping_method'].ship_rate_name;

                this.generalForm.patchValue({ ...data, approver_id: data.aprvr_id });
                this.list.items = data.inv_detail;
                this.updateTotal();
                this.currentBuyerId = data.company_id;

                // Lazy Load filter
                const params = { page: this.data['page'], length: 100, buyer_id: this.currentBuyerId };
                Object.keys(params).forEach((key) => (params[key] === null || params[key] === '') && delete params[key]);
                this.orderService.getAllCustomer(params).subscribe(result => {
                    const idList = result.data.rows.map(item => item.id);
                    this.listMaster['customer'] = result.data.rows;
                    this.changeCustomer(1);
                    // if (res.data.buyer_id && idList.indexOf(res.data.buyer_id) === -1) {
                    //     this.listMaster['customer'].push({ id: res.data.buyer_id, company_name: res.data.buyer_name , name: res.data.buyer_name});
                    // }
                    this.data['total_page'] = result.data.total_page;
                    this.refresh();
                });
            } catch (e) {
                console.log(e);
            }
        });
    }

    getQuickbookSettings() {
        this.financialService.getSettingInfoQuickbook().subscribe(
            res => {
                this.isInstallQuickbook = res.data.state === 'authorized' ? true : false;
            }, err => { }
        );
    }

    getListPaymentMethod() {
        return new Promise(resolve => {
            this.financialService.getPaymentMethod().subscribe(res => {
                this.listMaster['payment_method'] = res.data;
                this.refresh();
                resolve(true);
            });
        });
    }

    getListPaymentTerm() {
        return new Promise(resolve => {
            this.financialService.getListPaymentTerm().subscribe(res => {
                this.listMaster['payment_term'] = res.data;
                this.refresh();
                resolve(true);
            });
        });
    }

    getOrderByCustomerId(company_id, flag?) {
        const params = {
            cus_id: company_id
        };
        this.financialService.getOrderByCustomerId(params).subscribe(res => {
            try {
                this.listMaster['sales_order'] = res.data;
                // if (flag) {
                //     const order = this.listMaster['sales_order'].find(item => +item.id === this.generalForm.value.order_id);
                //     if (order) {
                //         this.changeSalesOrder(order, flag);
                //     }
                // }
                this.refresh();
            } catch (e) {
                console.log(e);
            }
        });
    }

    getGenerateCode() {
        this.financialService.getGenerateCode().subscribe(res => {
            this.generalForm.get('inv_num').patchValue(res.data.code);
            this.refresh();
        });
    }

    getEarlyPaymentValue() {
        const issue_dt = this.generalForm.get('inv_dt').value;
        const payment_term_id = this.generalForm.get('payment_term_id').value;
        const payment_term = this.listMaster['payment_term'].find(item => item.id === this.generalForm.get('payment_term_id').value) || {};
        this.data['is_early'] = payment_term.early_pmt_incentive;
        const total_due = this.order_info['total'];
        if (issue_dt && payment_term_id && total_due && this.data['is_early']) {
            this.financialService.getEarlyPaymentValue(issue_dt, payment_term_id, total_due).subscribe(res => {
                if (res.data) {
                    this.data['is_fixed_early'] = res.data.is_fixed;
                    this.order_info.incentive_percent = (!this.data['inited'] && !this.data['is_fixed_early']) ? this.data['invoice'].early_percent : res.data.percent;
                    this.order_info.incentive = (!this.data['inited'] && this.data['is_fixed_early']) ? this.data['invoice'].policy_amt : res.data.value;
                    this.order_info.expires_dt = res.data.expires_dt;
                    this.order_info.grand_total = this.order_info.total - this.order_info.incentive;
                    if (!this.data['inited']) {
                        this.updateTotal();
                    }
                    this.data['inited'] = true;
                    this.refresh();

                }
            });
        } else {
            // Reset Early Payment data
            this.order_info['incentive'] = null;
            this.order_info['incentive_percent'] = null;
            this.data['inited'] = true;
            this.refresh();

        }
    }

    getPaymentTermRange(id) {
        const paymentTerm = (this.listMaster['payment_term'] || []).find(item => item.id === id);
        return paymentTerm.term_day;
    }

    changePaymentTerms() {
        const listPaymentTerms = this.listMaster['payment_term'];
        for (const unit of listPaymentTerms) {
            if (unit.id === this.generalForm.value['payment_term_id']) {
                this.generalForm.controls['payment_term_range'].setValue(unit.term_day);
                this.getInvoiceDueDate(this.generalForm.value['payment_term_range']);
                this.refresh();
            }
        }
    }

    getInvoiceDueDate(paymentTermDayLimit) {
        const params = {
            issue_dt: this.generalForm.value['inv_dt'],
            payment_term_dt: paymentTermDayLimit
        };
        this.financialService.getInvoiceDueDate(params).subscribe(res => {
            try {
                if (params['payment_term_dt'] && res.data.due_dt) {
                    this.generalForm.controls['due_dt'].setValue(this.dt.transform(new Date(res.data.due_dt), 'MM/dd/yyyy'));
                }
                this.getDefaultNote();
                this.refresh();
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
                    this.listMaster['customer'] = [...this.listMaster['customer'], { id: res.data.company_id, company_name: res.data.company_name, name: res.data.company_name }];
                }

                if (res.data.buyer_type === 'PS' && res.data.contact[0]) {
                    this.addr_select.contact = res.data.contact[0];
                    this.generalForm.patchValue({ contact_user_id: res.data.contact[0]['id'] });
                }
                if (flag) {
                    this.selectAddress('billing', flag);
                    this.selectAddress('shipping', flag);
                    this.selectContact();
                }
                this.refresh();
            } catch (e) {
                console.log(e);
            }
        });
    }

    /**
     * Internal Function
     */
    selectData(data) { }

    changeLateFee() {
        const late_fee = this.generalForm.value.apply_late_fee;
        if (late_fee) {
            this.getDefaultNote();
        } else {
            this.generalForm.patchValue({ note: null });
        }
        this.refresh();
    }

    changeSalesOrder(event, flag?) {
        this.getOrderDetail(this.generalForm.value.order_id, flag);
    }

    getOrderDetail(id, flag?) {
        if (id) {
            this.orderService.getOrderDetail(id).subscribe(res => {
                const event = res.data;

                if (!flag) {
                    this.list.items = event.items.map(item => {
                        item.qty_inv = item.qty_remain;
                        item.qty = item.qty_remain;
                        item.price = item.sale_price;
                        return item;
                    });
                    this.refresh();
                }

                this.data['order_detail'] = { ...event, sales_person: event.sale_person_id, sale_person_name: event.sale_person_name, ship_rate: event.ship_method_rate };
                this.data['shipping_address'] = event.shipping_address;
                this.data['shipping_method'] = event.shipping_method;

                if (!flag) {
                    this.generalForm.patchValue({
                        ...this.data['order_detail'], inv_dt: this.generalForm.value.inv_dt,
                    });
                }

                this.selectAddress('billing');
                this.updateTotal();

            });
        }

    }


    changeCustomer(flag?) {
        const company_id = this.generalForm.value.company_id;
        if (company_id) {
            this.getDetailCustomerById(company_id, flag);
            this.getOrderByCustomerId(company_id, flag);
        }

        if (!flag) {
            this.resetChangeData();
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
                    this.addr_select.billing = (billing_id) ? this.findDataById(billing_id, this.customer.billing) : {};
                    break;
            }
            this.refresh();
        } catch (e) {
            console.log(e);
        }
    }

    findDataById(id, arr) {
        const item = arr.filter(x => x.address_id === id);
        return item[0];
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
            item.amount = (+item.qty_inv * (+item.price || 0)) * (100 - (+item.discount_percent || 0)) / 100;
            this.order_info.sub_total += item.amount;
        });
        this.order_info.total = +this.order_info['total_tax'] + +this.order_info.sub_total;
        if (this.order_info.incentive_percent) {
            this.order_info.incentive = +this.order_info.incentive_percent * +this.order_info.total / 100;
        }
        this.order_info.grand_total = +this.order_info.total - +this.order_info.incentive;
        this.refresh();
    }

    deleteAction(id, item_condition) {
        this.list.items = this.list.items.filter((item) => {
            return (item.item_id + (item.item_condition_id || 'mis') !== (id + (item.item_condition_id || 'mis')));
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
                taxAmount += (+i.tax_percent * +i.qty_inv * ((+i.price || 0) * (100 - (+i.discount_percent || 0)) / 100) / 100);
            });
            this.order_info['total_tax'] = this.order_info['total_tax'] + +(taxAmount.toFixed(2));
            this.order_info['taxs'].push({
                value: tax, amount: taxAmount.toFixed(2)
            });
        });
        this.refresh();
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
        this.generalForm.reset();
        this.ngOnInit();
        this.refresh();
    }

    createInvoice(type, is_draft?, is_continue?) {
        const items = this.list.items.map(item => {
            item.is_item = (item.misc_id) ? 0 : 1;
            return item;
        });

        const params = {
            ...this.generalForm.value,
            inv_status: type,
            sub_total: this.order_info.sub_total,
            total_due: this.order_info.total,
            is_early: this.data['is_early'] || 0,
            early_percent: (this.data['is_fixed_early']) ? null : (this.order_info['incentive_percent'] || 0),
            policy_amt: (this.order_info['incentive'] || 0),
            aprvr_id: this.generalForm.value.approver_id,
            sale_person_id: this.generalForm.value.sales_person,
            inv_detail: items,
            is_draft: is_draft || 0,
            policy_des: this.order_info['expires_dt'] || null,
        };

        this.financialService.updateInvoice(this.data['id'], params).subscribe(res => {
            try {
                if (res.status) {
                    this.toastr.success(res.message);
                    if (type === 4 && this.isInstallQuickbook) {
                        this.financialService.syncInvoiceToQuickbook(this.data['id']).subscribe(
                            _res => {
                                try {
                                    const result = JSON.parse(_res['_body']);
                                    this.toastr.success(`Invoice ${result.data[0].entity.DocNumber} has been sync to Quickbooks successfully.`);
                                } catch (err) { }
                            },
                            err => {
                                this.toastr.error(`Cannot sync invoice to Quickbooks.`);
                            }
                        );

                        // if (!this.data['only_validate']) {
                        //     this.router.navigate(['/financial/receipt-voucher/create'], { queryParams: { invoice_id: this.data['id'] } });
                        //     return;
                        // }
                    }
                    if (type === 4 && !this.data['only_validate']) {
                        this.router.navigate(['/financial/receipt-voucher/create'], { queryParams: { invoice_id: this.data['id'] } });
                        return;
                    }
                    if (!is_continue) {
                        setTimeout(() => {
                            this.router.navigate(['/financial/invoice/view/' + this.data['id']]);
                        }, 500);
                    }
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
                    this.createInvoice(type, is_draft_sq);
                } else {
                    this.router.navigate(['/financial/invoice']);
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
        const params = { page: this.data['page'], length: 100, buyer_id: this.currentBuyerId };
        if (this.data['searchKey']) {
            params['company_name'] = this.data['searchKey'];
        }
        Object.keys(params).forEach((key) => (params[key] === null || params[key] === '') && delete params[key]);
        this.orderService.getAllCustomer(params).subscribe(res => {
            this.listMaster['customer'] = this.listMaster['customer'].concat(res.data.rows);
            this.data['total_page'] = res.data.total_page;
            this.refresh();
        });
    }

    searchCustomer(key) {
        this.data['searchKey'] = key;
        const params = { page: this.data['page'], length: 100, buyer_id: this.currentBuyerId };
        if (key) {
            params['company_name'] = key;
        }
        Object.keys(params).forEach((_key) => (params[_key] === null || params[_key] === '') && delete params[_key]);
        this.orderService.getAllCustomer(params).subscribe(res => {
            this.listMaster['customer'] = res.data.rows;
            this.data['total_page'] = res.data.total_page;
            this.refresh();
        });
    }
    selectTable() {
        this.selectedIndex = 0;
        this.table.element.nativeElement.querySelector('td a').focus();
    }
}
