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
import { CreditMemoService } from './../credit-memo.service';


@Component({
    selector: 'app-apply-credit-memo',
    templateUrl: './apply-credit.component.html',
    styleUrls: ['../credit-memo.component.scss'],
    providers: [OrderService, HotkeysService, CreditMemoCreateKeyService, { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }],
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

    public messageConfig = {
        'default': 'The data you have entered may not be saved, are you sure that you want to leave?',
    };

    public list = {
        items: [],
        checklist: []
    };
    public checkAllItem;

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
        private dt: DatePipe) {
        //  Init Key
        this.keyService.watchContext.next({ context: this, service: this._hotkeysService });
        this.searchForm = fb.group({
            'doc_type': [null],
            'code': [null]
        });
    }

    async ngOnInit() {
        this.data['id'] = this.route.snapshot.paramMap.get('id');
        this.listMaster['docType'] = [{ id: 1, name: 'Invoice' }, { id: 2, name: 'Debit Memo' }];
        await this.getDataApplyByCreditId(this.data['id']);
    }
    getDataApplyByCreditId(id) {
        this.creditMemoService.getDataForApplyById(id).subscribe(res => {
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
        const params = { ...this.searchForm.value };
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
                this.list.items = res.data.rows;
                this.updateBalance();
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
    updateBalance() {
        this.main_info.total_amount = this.main_info.total_balance_due = this.main_info.total_current_balance = 0;
        if (this.list.items.length > 0) {
            this.list.items.map(item => {
                console.log(item);
                item.balance_due = (item.amount !== undefined) ? ( item.original_amount - item.amount) : 0;
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
        const params = { ...this.main_info, ...{ apply_detail: items } };
        console.log(params);
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


}
