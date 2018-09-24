import { Component, ElementRef, OnInit, Renderer, ViewChild, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TableService } from './../../../services/table.service';
import { ReceiptVoucherService } from './receipt-voucher.service';

import { environment } from '../../../../environments/environment';
import { ConfirmModalContent } from '../../../shared/modals/confirm.modal';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HotkeysService } from 'angular2-hotkeys';
import { ToastrService } from 'ngx-toastr';
import { routerTransition } from '../../../router.animations';
import { ReceiptKeyService } from './keys.list.control';
import { ReceiptMailModalComponent } from './modals/mail.modal';


@Component({
    selector: 'app-receipt-voucher',
    templateUrl: './receipt-voucher.component.html',
    styleUrls: ['./receipt-voucher.component.scss'],
    animations: [routerTransition()],
    providers: [ReceiptKeyService, HotkeysService, TableService, ReceiptVoucherService]
})
export class ReceiptVoucherComponent implements OnInit {
    public listMaster = {};
    public listInvoiceItemsRef = [];
    public selectedIndex = 0;
    public list = {
        items: []
    };
    public user: any;
    public onoffFilter: any;

    searchForm: FormGroup;

    public messageConfig = {
        '2': 'Are you sure that you want to submit this credit memo?',
        '5': 'Are you sure that you want to cancel this credit memo?',
        'RE-OPEN': 'Are you sure that you want to reopen the credit memo?',
        '3': 'Are you sure that you want to approve the current credit memo?',
        '4': 'Are you sure that you want to reject the current credit memo?'
    };

    public statusConfig = {
        'NW': { color: 'blue', name: 'New', img: './assets/images/icon/new.png' },
        'SB': { color: 'texas-rose', name: 'Submited' },
        'RJ': { color: 'magenta', name: 'Rejected' },
        'RC': { color: 'strong-green', name: 'Approved', img: './assets/images/icon/approved.png' },
        'CC': { color: 'red', name: 'Canceled', img: './assets/images/icon/cancel.png' },
        // 'SC': { color: 'lemon', name: 'Completed', img: './assets/images/icon/full_delivered.png' },
        'ER': { color: 'lemon', name: 'Refund Due' },
    };

    constructor(public router: Router,
        public fb: FormBuilder,
        public toastr: ToastrService,
        public tableService: TableService,
        private receiptVoucherService: ReceiptVoucherService,
        private modalService: NgbModal,
        private _hotkeysService: HotkeysService,
        public receiptKeyService: ReceiptKeyService,
        private http: HttpClient,
        private renderer: Renderer) {

        this.searchForm = fb.group({
            'receipt_no': [null],
            'payment_method': [null],
            'customer_id': [null],
            'electronic': [null],
            'status': [null],
            'date_type': [null],
            'date_from': [null],
            'date_to': [null]
        });

        //  Assign get list function name, override letiable here
        this.tableService.getListFnName = 'getList';
        this.tableService.context = this;
        //  Init Key
        this.receiptKeyService.watchContext.next({ context: this, service: this._hotkeysService });

    }

    ngOnInit() {
        //  Init Fn
        this.listMaster['dateType'] = [{ id: 'payment_date', name: 'Payment Date' }, { id: 'created_at', name: 'Creadted On' }, { id: 'updated_at', name: 'Updated On' }];
        this.listMaster['electType'] = [{ id: 0, name: 'No' }, { id: 1, name: 'Yes' }];
        // Function Init
        this.getList();
        this.getCountStatus();
        this.getListReferenceData();
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
    getCountStatus() {
        this.receiptVoucherService.countVoucherStatus().subscribe(res => {
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
    getListReferenceData() {
        this.receiptVoucherService.getVoucherMasterData().subscribe(res => {
            console.log(res);
        });
    }
    filter(status) {
        const params = { status };
        this.receiptVoucherService.getListReceiptVoucher(params).subscribe(res => {
            try {
                this.list.items = res.data.rows;
                this.tableService.matchPagingOption(res.data);
            } catch (e) {
                console.log(e);
            }
        });
    }

    getList() {
        const params = { ...this.tableService.getParams(), ...this.searchForm.value };
        Object.keys(params).forEach((key) => {
            if (params[key] instanceof Array) {
                params[key] = params[key].join(',');
            }
            // tslint:disable-next-line:no-unused-expression
            (params[key] === null || params[key] === '') && delete params[key];
        });

        params.order = 'id';
        params.sort = 'desc';

        this.receiptVoucherService.getListReceiptVoucher(params).subscribe(res => {
            try {
                this.list.items = res.data.rows;
                this.tableService.matchPagingOption(res.data);
            } catch (e) {
                console.log(e);
            }
        });
    }

    viewReceipt(id?) {
        if (id) {
            this.router.navigate(['/financial/receipt-voucher/view', id]);
        } else {
            const selectedInvoiceId = this.list.items[this.selectedIndex].id;
            if (selectedInvoiceId) {
                this.router.navigate(['/financial/receipt-voucher/view', selectedInvoiceId]);
            }
        }
    }

    editReceipt(id?) {
        if (id) {
            this.router.navigate(['/financial/receipt-voucher/edit', id]);
        } else {
            const selectedInvoiceId = this.list.items[this.selectedIndex].id;
            const selectedInvoiceStatus = this.list.items[this.selectedIndex].invoice_status_id;
            if (selectedInvoiceId && selectedInvoiceStatus === 1) {
                this.router.navigate(['/financial/receipt-voucher/edit', selectedInvoiceId]);
            }
        }
    }

}
