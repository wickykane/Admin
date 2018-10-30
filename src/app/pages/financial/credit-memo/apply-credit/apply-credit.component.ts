import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, Renderer, ViewChild, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateParserFormatter, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectComponent } from '@ng-select/ng-select';

import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs/Subject';
import { routerTransition } from '../../../../router.animations';

import { NgbDateCustomParserFormatter } from '../../../../shared/helper/dateformat';
import { CreditMemoCreateKeyService } from './keys.control';

import { HotkeysService } from 'angular2-hotkeys';
import * as lodash from 'lodash';
import { ConfirmModalContent } from '../../../../shared/modals/confirm.modal';
import { OrderService } from '../../../order-mgmt/order-mgmt.service';
import { TableService } from './../../../../services/table.service';
import { CreditMemoService } from './../credit-memo.service';


@Component({
    selector: 'app-apply-credit-memo',
    templateUrl: './apply-credit.component.html',
    styleUrls: ['../credit-memo.component.scss'],
    providers: [OrderService, HotkeysService, CreditMemoCreateKeyService, { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }, TableService],
    animations: [routerTransition()]
})

export class CreditMemoApplyComponent implements OnInit {
    /**
     * Variable Declaration
     */

    public listMaster = {};
    public selectedIndex = 0;
    public data = {};
    public main_info = {
        used_price: 0,
        original_amount: 0,
        remain_amount: 0,
        total_current_balance: 0,
        total_balance_due: 0,
        total_amount: 0
    };
    searchForm: FormGroup;
    public generalForm: FormGroup;

    public messageConfig = {
        'default': 'The data you have entered may not be saved, are you sure that you want to leave?',
    };

    public list = {
        items: [],
        checklist: []
    };
    public copy_list = [];
    public checkAllItem;
    accountList: any;

    /**
     * Init Data
     */
    constructor(
        private vRef: ViewContainerRef,
        private fb: FormBuilder,
        public toastr: ToastrService,
        private router: Router,
        private route: ActivatedRoute,
        private modalService: NgbModal,
        private orderService: OrderService,
        private _hotkeysService: HotkeysService,
        public keyService: CreditMemoCreateKeyService,
        private creditMemoService: CreditMemoService,
        public tableService: TableService,
        private dt: DatePipe) {
        //  Init Key
        //  Assign get list function name, override letiable here
        this.tableService.getListFnName = 'getDataApplyByCreditId';
        this.tableService.context = this;
        this.keyService.watchContext.next({ context: this, service: this._hotkeysService });
        this.searchForm = fb.group({
            'code': [null]
        });
        this.generalForm = fb.group({
            'gl_account': [null, Validators.required],
            'warehouse_id': [1, Validators.required]
        });
    }

    async ngOnInit() {
        this.data['id'] = this.route.snapshot.paramMap.get('id');
        await this.getDataApplyByCreditId();
        await this.getListAccountGL();
        this.listMaster['docType'] = [{ id: 1, name: 'Invoice' }, { id: 2, name: 'Debit Memo' }];
        this.orderService.getOrderReference().subscribe(res => {
            Object.assign(this.listMaster, res.data);
        });
    }
    // Table event
    selectData(index) {
        console.log(index);
    }

    getDataApplyByCreditId() {
        this.creditMemoService.getDataForApplyById(this.data['id']).subscribe(res => {
            try {
                this.main_info = { ...this.main_info, ...res.data };
                console.log(this.main_info);
                if (res.data.company_id) {
                    this.getList(res.data.company_id);
                }
            } catch (e) {
                console.log(e);
            }
        }, error => {

        });
    }
    getList(id) {
        const params = { ...this.searchForm.value, ...this.tableService.getParams() };
        Object.keys(params).forEach((key) => {
            if (params[key] instanceof Array) {
                params[key] = params[key].join(',');
            }
            // tslint:disable-next-line:no-unused-expression
            (params[key] === null || params[key] === '') && delete params[key];
        });
        Object.keys(params).forEach((key) => (params[key] === null || params[key] === '') && delete params[key]);

        this.creditMemoService.getTableDataInvoiceById(id, params).subscribe(res => {
            try {
                this.copy_list = res.data.rows;
                this.tableService.matchPagingOption(res.data);
                this.updateBalance();
                this.queryInvoiceByWH();
            } catch (e) {
                console.log(e);
            }
        });
    }
    checkAll(ev) {
        this.list.items.forEach(x => x.is_checked = ev.target.checked);
        this.list.checklist = this.list.items.filter(_ => _.is_checked);
    }

    isAllChecked() {
        this.checkAllItem = this.list.items.every(_ => _.is_checked);
        this.list.checklist = this.list.items.filter(_ => _.is_checked);
    }
    clearPayment() {
        if (this.list.items.length > 0) {
            this.list.items.map(item => { item.amount = 0; item.is_checked = false; });
        }
        this.list.checklist = [];
        this.updateBalance();
    }
    queryInvoiceByWH() {
        const warehouse_id = this.generalForm.value.warehouse_id;
        console.log(warehouse_id);
        if (this.copy_list.length  > 0 ) {
            this.list.items = this.copy_list.filter( item => Number(item.warehouse_id) === Number( warehouse_id));
            this.list.checklist = [];
            this.updateBalance();
        }

    }
    updateBalance() {
        this.main_info.total_amount = this.main_info.total_balance_due = this.main_info.total_current_balance = 0;
        if (this.list.items.length > 0) {
            this.list.items.map(item => {
                item.balance_due = (item.amount !== undefined) ? (item.original_amount - item.amount) : 0;
                this.main_info.total_current_balance += item.original_amount;
                this.main_info.total_balance_due += item.balance_due;
                this.main_info.total_amount += item.amount || 0;
                return item;
            });
        }
        this.main_info.remain_amount = Number(this.main_info.original_amount - this.main_info.total_amount);
    }

    // Apply credit
    createApplyCredit() {
        const items = this.list.checklist.map(item => {
            return item;
        });
        const params = { ...this.main_info, ...this.generalForm.value, ...{ apply_detail: items } };
        this.creditMemoService.applyCreditForInvoice(this.data['id'], params).subscribe(res => {
            try {
                if (res.status) {
                    this.toastr.success(res.message);
                    setTimeout(() => {
                        this.router.navigate(['/financial/credit-memo']);
                    }, 500);

                } else {
                    this.toastr.error(res.message);
                }
            } catch (e) {
                console.log(e);
            }
        });
    }

    // Cancel
    confirmModal() {
        const modalRef = this.modalService.open(ConfirmModalContent, { size: 'lg', windowClass: 'modal-md' });
        modalRef.result.then(res => {
            if (res) {
                this.router.navigate(['/financial/credit-memo']);
            }
        }, dismiss => { });
        modalRef.componentInstance.message = this.messageConfig['default'];
        modalRef.componentInstance.yesButtonText = 'Yes';
        modalRef.componentInstance.noButtonText = 'No';
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


}
