import { Component, ElementRef, OnInit, Renderer, ViewChild, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TableService } from '../../../../services/table.service';
import { CreditMemoListKeyService } from './keys.list.control';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HotkeysService } from 'angular2-hotkeys';
import { ToastrService } from 'ngx-toastr';
import { routerTransition } from '../../../../router.animations';
import { ConfirmModalContent } from '../../../../shared/modals/confirm.modal';
import { CreditMemoService } from '../credit-memo.service';
import { SendMailDebitModalContent } from '../modals/send-email/send-mail.modal';


@Component({
    selector: 'app-credit-memo-list',
    templateUrl: './credit-memo-list.component.html',
    styleUrls: ['../credit-memo.component.scss'],
    animations: [routerTransition()],
    providers: [CreditMemoListKeyService]
})
export class CreditMemoListComponent implements OnInit {
    /**
     * letiable Declaration
     */

    public listMaster = {};
    public selectedIndex = 0;
    public list = {
        items: []
    };
    public user: any;
    public onoffFilter: any;

    searchForm: FormGroup;

    public messageConfig = {
        'SM': 'Are you sure that you want to Submit this quotation to approver?',
        'CC': 'Are you sure that you want to cancel this quotation?',
        'CLONE': 'Are you sure that you want to copy this quote?',
        'AM': 'Are you sure that you want to approve this quotation?',
        'RM': 'Are you sure that you want to reject this quotation?',
        'SC': 'Are you sure that you want to convert this quotation to SO?',
    };

    public statusConfig = {
        'NW': { color: 'blue', name: 'New', img: './assets/images/icon/new.png' },
        'SM': { color: 'texas-rose', name: 'Submited' },
        'RM': { color: 'magenta', name: 'Rejected' },
        'AM': { color: 'strong-green', name: 'Approved', img: './assets/images/icon/approved.png' },
        // 'RB': { color: 'magenta', name: 'Rejected By Buyer' },
        // 'AB': { color: 'strong-green', name: 'Approved By Buyer', img: './assets/images/icon/approved.png' },
        'CC': { color: 'red', name: 'Canceled', img: './assets/images/icon/cancel.png' },
        'SC': { color: 'lemon', name: 'Completed', img: './assets/images/icon/full_delivered.png' },
        // 'RO': { color: 'darkblue', name: 'Reopen' },
        // 'IU': { color: 'darkblue', name: 'In use' },
        'EX': { color: 'bright-grey', name: 'Expired' },
    };

    constructor(public router: Router,
        public fb: FormBuilder,
        public toastr: ToastrService,
        public tableService: TableService,
        private orderService: CreditMemoService,
        private modalService: NgbModal,
        private _hotkeysService: HotkeysService,
        public creditMemoListKeyService: CreditMemoListKeyService,
        private renderer: Renderer) {

        this.searchForm = fb.group({
            'quote_no': [null],
            'buyer_name': [null],
            'sts': [null],
            'date_type': [null],
            'date_from': [null],
            'date_to': [null]
        });

        //  Assign get list function name, override letiable here
        this.tableService.getListFnName = 'getList';
        this.tableService.context = this;
        //  Init Key
        this.creditMemoListKeyService.watchContext.next({ context: this, service: this._hotkeysService });

    }

    ngOnInit() {
        //  Init Fn
        this.listMaster['listFilter'] = [{ value: false, name: 'Date Filter' }];
        this.listMaster['dateType'] = [{ id: 'quote_dt', name: 'Quote Date' }, { id: 'expiry_dt', name: 'Expiry Date' }, { id: 'delivery_dt', name: 'Delivery Date' }];
        this.getList();
        this.getListStatus();
        this.user = JSON.parse(localStorage.getItem('currentUser'));
    }
    /**
     * Table Event
     */
    selectData(index) {
        console.log(index);
    }
    /**
     * Internal Function
     */
    getListStatus() {
        this.orderService.getListSaleQuotationStatus().subscribe(res => {
            try {
                this.listMaster['listStatus'] = res.data;
            } catch (e) {
                console.log(e);
            }
        });
    }

    moreFilter() {
        this.onoffFilter = !this.onoffFilter;
    }

    filter(status) {
        const params = { sts: status };
        this.orderService.getListSalesQuotation(params).subscribe(res => {
            try {
                this.list.items = res.data.rows;
                this.tableService.matchPagingOption(res.data);
            } catch (e) {
                console.log(e);
            }
        });
    }

    getCountStatus() {
        this.orderService.getQuoteCountStatus().subscribe(res => {
            res.data.map(item => {
                if (this.statusConfig[item.cd]) {
                    this.statusConfig[item.cd].count = item.count;
                    this.statusConfig[item.cd].status = item.id;
                    this.statusConfig[item.cd].name = item.name;
                }
            });
            this.listMaster['count-status'] = Object.keys(this.statusConfig).map(key => {
                return this.statusConfig[key];
            });
        });
    }

    getList() {
        this.getCountStatus();
        const params = { ...this.tableService.getParams(), ...this.searchForm.value };

        Object.keys(params).forEach((key) => {
            if (params[key] instanceof Array) {
                params[key] = params[key].join(',');
            }
            // tslint:disable-next-line:no-unused-expression
            (params[key] === null || params[key] === '') && delete params[key];
        });
        Object.keys(params).forEach((key) => (params[key] === null || params[key] === '') && delete params[key]);

        this.orderService.getListSalesQuotation(params).subscribe(res => {
            try {
                this.list.items = res.data.rows;
                this.tableService.matchPagingOption(res.data);
            } catch (e) {
                console.log(e);
            }
        });
    }

    updateStatus(id, status) {
        const params = { status };
        this.orderService.updateSaleQuoteStatus(id, params).subscribe(res => {
            try {
                this.toastr.success(res.message);
                this.getList();
            } catch (e) {
                console.log(e);
            }
        });
    }

    cloneQuote(id) {
        this.router.navigate(['/order-management/sale-quotation/create'], { queryParams: { is_copy: 1, quote_id: id } });
    }

    confirmModal(id, status) {
        const modalRef = this.modalService.open(ConfirmModalContent, { size: 'lg', windowClass: 'modal-md' });
        modalRef.result.then(res => {
            if (res) {
                if (status === 'CLONE') {
                    this.cloneQuote(id);
                    return;
                }
                this.updateStatus(id, status);
            }
        }, dismiss => { });
        modalRef.componentInstance.message = this.messageConfig[status];
        modalRef.componentInstance.yesButtonText = 'Yes';
        modalRef.componentInstance.noButtonText = 'No';
    }
}


