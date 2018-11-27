import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer, ViewChild, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateParserFormatter, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectComponent } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs/Subject';
import { routerTransition } from '../../../../router.animations';
import { cdArrowTable } from '../../../../shared';

import { HotkeysService } from 'angular2-hotkeys';
import * as lodash from 'lodash';
import { NgbDateCustomParserFormatter } from '../../../../shared/helper/dateformat';
import { ConfirmModalContent } from '../../../../shared/modals/confirm.modal';
import { OrderService } from '../../../order-mgmt/order-mgmt.service';
import { TableService } from './../../../../services/table.service';
import { CreditMemoService } from './../credit-memo.service';
import { CreditMemoCreateKeyService } from './keys.control';


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
    public savedItems = {
        totalAmount: 0,
        usedAmount: 0,
        remainAmount: 0,
        items: []
    };
    public main_info = {
        used_price: 0,
        original_amount: 0,
        remain_amount: 0,
        total_current_balance: 0,
        total_balance_due: 0,
        total_amount: 0,
        total_tot_price: 0
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
    @ViewChild(cdArrowTable) table: cdArrowTable;
    /**
     * Init Data
     */
    constructor(
        private vRef: ViewContainerRef,
        private fb: FormBuilder,
        public toastr: ToastrService,
        private router: Router,
        private cd: ChangeDetectorRef,
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
        this.tableService.pagination.length = 1000;
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
        params.warehouse_id = this.generalForm.value.warehouse_id;
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
                // this.copy_list = res.data.rows;
                this.list.items = res.data.rows;
                // this.tableService.matchPagingOption(res.data);
                this.updateBalance();
                // this.queryInvoiceByWH();
                this.updateSavedItems();
                this.updateAmountReceived(true);
            } catch (e) {
                console.log(e);
            }
        });
    }
    selectData(ev) {
        console.log(ev);
        const button = this.table.element.nativeElement.querySelectorAll('td label input');
        if (button && button[this.selectedIndex]) {
            button[this.selectedIndex].click();
        }
    }
    checkAll(ev) {
        this.list.items.forEach(x => x.is_checked = ev.target.checked);
        this.list.checklist = this.list.items.filter(_ => _.is_checked);
        this.updateCheckedSavedItems();
        this.fillAppliedAmountToAllItem();
    }

    isAllChecked(index) {
        this.checkAllItem = this.list.items.every(_ => _.is_checked);
        this.list.checklist = this.list.items.filter(_ => _.is_checked);
        this.updateCheckedSavedItems();
        if (!this.list['items'][index].is_checked) {
            const savedIndex = this.savedItems['items'].findIndex(savedItem => savedItem.id === this.list['items'][index].id);
            this.savedItems['items'][savedIndex]['amount'] = 0;
            this.list['items'][index]['amount'] = 0;
            this.fillAppliedAmountToAllItem(index, false);
        } else {
            this.fillAppliedAmountToAllItem();
        }
    }

    refreshSavedItems(isClearAll) {
        if (isClearAll) {
            this.savedItems = {
                totalAmount: 0,
                usedAmount: 0,
                remainAmount: 0,
                items: []
            };
        } else {
            this.savedItems['items'] = [];
            this.savedItems['remainAmount'] = this.savedItems['totalAmount'];
            this.savedItems['usedAmount'] = 0;
        }
    }

    updateAmountReceived(isGetFromDetail?) {
        const newAmount = parseFloat(this.main_info['total_price']) || 0;
        if (this.savedItems['totalAmount'] !== newAmount) {
            this.savedItems['totalAmount'] = newAmount;
            this.savedItems['remainAmount'] = newAmount;
            this.savedItems['usedAmount'] = 0;
            if (!isGetFromDetail) {
                this.fillAppliedAmountToAllItem();
            } else {
                this.savedItems['usedAmount'] = this.calculateTotalUsedAmount();
                this.savedItems['remainAmount'] = this.savedItems['totalAmount'] - this.savedItems['usedAmount'];
            }
        }
    }

    fillAppliedAmountToAllItem(itemIndex?, isChangePrice?) {
        this.savedItems['remainAmount'] = parseFloat(this.main_info['total_price']) || 0;
        const savedItemIndex = (itemIndex !== undefined && itemIndex !== null) ? this.savedItems['items'].findIndex(savedItem => savedItem.id === this.list.items[itemIndex]['id']) : null;

        if (savedItemIndex !== -1 && savedItemIndex !== null) {
            if (isChangePrice) {
                this.savedItems['items'][savedItemIndex]['amount'] = this.list['items'][itemIndex]['amount'];
            }
            // if (this.generalForm.value.electronic) {
            //     this.list['items'][itemIndex]['amount'] = Math.min(this.list['items'][itemIndex]['original_amount'], this.list['items'][itemIndex]['remainAmount']);
            //     this.savedItems['items'][savedItemIndex]['amount'] = this.list['items'][itemIndex]['amount'];
            //     return;
            // }
            this.fillSelectedItem(savedItemIndex);
        }
        this.fillAppliedAmount(savedItemIndex);
        this.updateCurrentItems();
    }

    fillAppliedAmount(savedItemIndex?) {
        this.savedItems['usedAmount'] = 0;
        this.savedItems['items'].forEach((savedItem, index) => {
            const isFillAllItems = (savedItemIndex === undefined || savedItemIndex === null);
            const isFillFromIndex = (savedItemIndex !== undefined && savedItemIndex !== null && index > savedItemIndex);
            if (isFillAllItems || isFillFromIndex) {
                savedItem['amount'] = savedItem.is_checked ? Math.min(savedItem['original_amount'], this.savedItems['remainAmount']) : 0;
                savedItem['amount'] = lodash.round(savedItem['amount'], 2);
            }
            this.savedItems['usedAmount'] += savedItem['amount'];
            this.savedItems['remainAmount'] = this.savedItems['totalAmount'] - this.savedItems['usedAmount'];
            this.updateBalance();
        });
    }

    fillSelectedItem(itemIndex) {
        this.savedItems['items'][itemIndex]['amount'] = Math.min(
            this.savedItems['items'][itemIndex]['amount'],
            this.savedItems['items'][itemIndex]['original_amount'],
            (this.savedItems['remainAmount'] - this.calculateUsedAmount(itemIndex)));
        this.savedItems['items'][itemIndex]['amount'] = lodash.round(this.savedItems['items'][itemIndex]['amount'], 2);
    }

    calculateTotalUsedAmount() {
        let usedPrice = 0;
        this.savedItems['items'].forEach((item, index) => {
            usedPrice += item['amount'];
        });
        return lodash.round(usedPrice, 2);
    }

    calculateUsedAmount(savedItemIndex) {
        let usedPrice = 0;
        this.savedItems['items'].forEach((item, index) => {
            if (index < savedItemIndex) {
                usedPrice += item['amount'];
            }
        });
        return lodash.round(usedPrice, 2);
    }

    updateCheckedSavedItems() {
        this.list.items.forEach(item => {
            const index = this.savedItems['items'].findIndex(savedItem => savedItem.id === item.id);
            if (index >= 0 && (item['is_checked'] !== this.savedItems['items'][index]['is_checked'])) {
                this.savedItems['items'][index]['is_checked'] = item['is_checked'];
            }
        });
    }

    updateSavedItems() {
        if (!this.savedItems['items'].length) {
            this.savedItems['items'] = this.list.items;
        } else {
            this.list.items.forEach(item => {
                const index = this.savedItems['items'].findIndex(savedItem => savedItem.id === item.id);
                if (index < 0) {
                    this.savedItems['items'].push(item);
                } else {
                    item['is_checked'] = this.savedItems['items'][index]['is_checked'] || false;
                    item['amount'] = this.savedItems['items'][index]['amount'];
                }
            });
        }
        this.checkAllItem = this.list.items.every(item => item.is_checked);
    }

    updateCurrentItems() {
        this.list.items.forEach(item => {
            const index = this.savedItems['items'].findIndex(savedItem => savedItem.id === item.id);
            if (index >= 0) {
                item['is_checked'] = this.savedItems['items'][index]['is_checked'] || false;
                item['amount'] = this.savedItems['items'][index]['amount'];
            }
        });
    }

    onChangeWarehouse() {
        this.refreshSavedItems(true);
        this.getList(this.main_info['company_id']);
    }

    onSearch() {
        this.refreshSavedItems(true);
        // this.getList(this.main_info['company_id']);
        this.tableService.searchAction();
    }

    onReset() {
        this.searchForm.reset();
        this.refreshSavedItems(true);
        // this.getList(this.main_info['company_id']);
        this.tableService.resetAction(this.searchForm);
    }

    clearPayment() {
        this.refreshSavedItems(true);
        if (this.list.items.length > 0) {
            this.list.items.map(item => { item.amount = 0; item.is_checked = false; });
        }
        this.list.checklist = [];
        this.updateBalance();
        this.updateSavedItems();
        this.updateAmountReceived(true);
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
        this.main_info.total_amount = this.main_info.total_balance_due = this.main_info.total_current_balance  = this.main_info.total_tot_price = 0;
        if (this.list.items.length > 0) {
            this.list.items.map(item => {
                item.balance_due = (item.amount !== undefined) ? (lodash.round(item.original_amount, 2) - lodash.round(item.amount, 2)) : 0;
                this.main_info.total_current_balance += item.original_amount;
                this.main_info.total_balance_due += item.balance_due;
                this.main_info.total_tot_price += item.tot_price;
                this.main_info.total_amount += item.amount || 0;
                return item;
            });
        }
        this.main_info.remain_amount = Number(this.main_info.original_amount - this.main_info.total_amount);
    }

    // Apply credit
    createApplyCredit() {
        // const items = this.list.checklist.map(item => {
        //     return item;
        // });
        const items = this.savedItems['items'].filter(i => i.amount).map(item => {
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
    refresh() {
        if (!this.cd['destroyed']) { this.cd.detectChanges(); }
   }

    back() {
        this.router.navigate(['/financial/credit-memo']);
    }
    selectTable() {
        this.selectedIndex = 0;
        this.table.scrollToTable();
        setTimeout(() => {
            const button = this.table.element.nativeElement.querySelectorAll('td');
            if (button && button[this.selectedIndex]) {
                button[this.selectedIndex].focus();
            }
        });
        this.refresh();
    }
    selectAll() {
        this.table.element.nativeElement.querySelector('th label input').click();
       }
}
