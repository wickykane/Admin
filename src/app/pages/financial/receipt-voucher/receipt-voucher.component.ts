import { Component, ElementRef, OnInit, Renderer, ViewChild, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TableService } from './../../../services/table.service';
import { ReceiptVoucherService } from './receipt-voucher.service';

import { cdArrowTable } from '../../../shared';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HotkeysService } from 'angular2-hotkeys';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs/Subject';
import { routerTransition } from '../../../router.animations';
import { ConfirmModalContent } from '../../../shared/modals/confirm.modal';
import { OrderService } from '../../order-mgmt/order-mgmt.service';
import { FinancialService } from '../financial.service';
import { ReceiptKeyService } from './keys.list.control';


@Component({
    selector: 'app-receipt-voucher',
    templateUrl: './receipt-voucher.component.html',
    styleUrls: ['./receipt-voucher.component.scss'],
    animations: [routerTransition()],
    providers: [OrderService, ReceiptKeyService, HotkeysService, TableService, ReceiptVoucherService]
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
    public data = {};
    public isInstallQuickbook = false;
    searchForm: FormGroup;
    public searchKey = new Subject<any>(); // Lazy load filter

    public messageConfig = {
        '2': 'Are you sure that you want to submit this receipt voucher?',
        '6': 'Are you sure that you want to cancel this receipt voucher?',
        'RE-OPEN': 'Are you sure that you want to reopen the credit memo?',
        '3': 'Are you sure that you want to approve the current receipt voucher?',
        '4': 'Are you sure that you want to reject the current receipt voucher?'
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
    @ViewChild(cdArrowTable) table: cdArrowTable;
    constructor(public router: Router,
        public fb: FormBuilder,
        public toastr: ToastrService,
        public tableService: TableService,
        private receiptVoucherService: ReceiptVoucherService,
        private modalService: NgbModal,
        private _hotkeysService: HotkeysService,
        public receiptKeyService: ReceiptKeyService,
        public financialService: FinancialService,
        private orderService: OrderService,
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
        this.listMaster['dateType'] = [{ id: 'payment_date', name: 'Payment Date' }, { id: 'created_at', name: 'Created On' }, { id: 'updated_at', name: 'Updated On' }];
        this.listMaster['electType'] = [{ id: 0, name: 'No' }, { id: 1, name: 'Yes' }];
        // Function Init
        this.getQuickbookSettings();
        this.getList();
        this.getCountStatus();
        this.getListReferenceData();
        // Lazy Load filter
        this.data['page'] = 1;
        const params = { page: this.data['page'], length: 100 };
        this.orderService.getAllCustomer(params).subscribe(res => {
            this.listMaster['customer'] = res.data.rows;
            this.data['total_page'] = res.data.total_page;
        });
        this.searchKey.debounceTime(300).subscribe(key => {
            this.data['page'] = 1;
            this.searchCustomer(key);
        });
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
    getQuickbookSettings() {
        this.financialService.getSettingInfoQuickbook().subscribe(
            res => {
                this.isInstallQuickbook = res.data.state === 'authorized' ? true : false;
            }, err => { }
        );
    }
    getCountStatus() {
        this.receiptVoucherService.countVoucherStatus().subscribe(res => {
            this.listMaster['list-status'] = res.data;
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
        this.receiptVoucherService.getPaymentMethodOption().subscribe(res => {
            this.listMaster['paymentMethod'] = res.data.payment_method;
            console.log(this.listMaster['paymentMethod']);
        });
    }

    filter(status) {
        const params = { status };
        console.log(params);
        this.receiptVoucherService.getListReceiptVoucher(params).subscribe(res => {
            try {
                this.list.items = res.data.rows;
                this.tableService.matchPagingOption(res.data);
            } catch (e) {
                console.log(e);
            }
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
        });
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
        });
    }

    getList() {
        console.log(this.searchForm.value);
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
    updateStatus(id, status) {
        const params = { voucher_id: id, status };
        this.receiptVoucherService.updateReceiptVoucherStatus(params).subscribe(res => {
            try {
                this.toastr.success(res.message);
                // if (status === 3 && this.isInstallQuickbook) {
                //     this.financialService.syncReceiptVoucherToQuickbook(id).subscribe(
                //         _res => {
                //             try {
                //                 const result = JSON.parse(_res['_body']);
                //                 this.toastr.success(`Receipt Voucher ${result.data[0].entity.DocNumber} has been sync to Quickbooks successfully.`);
                //             } catch (err) {}
                //         },
                //         err => {
                //             this.toastr.error(`Cannot sync Receipt Voucher to Quickbooks.`);
                //         }
                //     );
                // }
                this.getList();
                this.getCountStatus();
            } catch (e) {
                console.log(e);
            }
        });
    }
    confirmModal(id, status) {
        const modalRef = this.modalService.open(ConfirmModalContent, { size: 'lg', windowClass: 'modal-md' });
        modalRef.result.then(res => {
            if (res) {
                this.updateStatus(id, status);
            }
        }, dismiss => { });
        modalRef.componentInstance.message = this.messageConfig[status];
        modalRef.componentInstance.yesButtonText = 'Yes';
        modalRef.componentInstance.noButtonText = 'No';
    }
    createReceiptVoucher() {
        this.router.navigate(['/financial/receipt-voucher/create']);
    }
    viewReceiptVoucher() {
        const id = this.list.items[this.selectedIndex].id;
        this.router.navigate(['/financial/receipt-voucher/view', id]);
    }
    selectTable() {
        this.selectedIndex = 0;
        this.table.element.nativeElement.querySelector('td a').focus();
    }
}
