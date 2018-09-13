import { Component, ElementRef, OnInit, Renderer, ViewChild, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FinancialService } from '../financial.service';
import { TableService } from './../../../services/table.service';

import { environment } from '../../../../environments/environment';
import { ConfirmModalContent } from '../../../shared/modals/confirm.modal';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HotkeysService } from 'angular2-hotkeys';
import { ToastrService } from 'ngx-toastr';
import { routerTransition } from '../../../router.animations';
import { InvoiceKeyService } from './keys.list.control';
import { ReceiptMailModalComponent } from './modals/mail.modal';


@Component({
    selector: 'app-receipt-voucher',
    templateUrl: './receipt-voucher.component.html',
    styleUrls: ['./receipt-voucher.component.scss'],
    animations: [routerTransition()],
    providers: [InvoiceKeyService, HotkeysService, TableService]
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
        1: 'Are you sure that you want to reopen the current invoice?',
        2: 'Are you sure that you want to submit the invoice to approver?',
        7: 'Are you sure that you want to cancel current invoice?',
        4: 'Are you sure that you want to approve the current invoice?',
        3: 'Are you sure that you want to reject the current invoice?',
    };


    public statusConfig = {
        'New': { color: 'blue', name: 'New', id: 1, img: './assets/images/icon/new.png' },
        'Submitted': { color: 'texas-rose', name: 'Submited', id: 2 },
        'Rejected': { color: 'magenta', name: 'Rejected', id: 3 },
        'Received': { color: 'strong-green', name: 'Approved', id: 4, img: './assets/images/icon/approved.png' },
        'Canceled': { color: 'red', name: 'Canceled', id: 7, img: './assets/images/icon/cancel.png' },
        'Error': { color: 'bright-grey', name: 'Overdue', id: 8 },
    };

    constructor(public router: Router,
        public fb: FormBuilder,
        public toastr: ToastrService,
        public tableService: TableService,
        private financialService: FinancialService,
        private modalService: NgbModal,
        private _hotkeysService: HotkeysService,
        public invoiceKeyService: InvoiceKeyService,
        private http: HttpClient,
        private renderer: Renderer) {

        this.searchForm = fb.group({
            'inv_num': [null],
            'cus_name': [null],
            'order_num': [null],
            'sku': [null],
            'status': [null],
            'inv_type': [null],
            'inv_dt_from': [null],
            'inv_dt_to': [null],
            'inv_due_dt_from': [null],
            'inv_due_dt_to': [null],
            'elect_type': [null],
        });

        //  Assign get list function name, override letiable here
        this.tableService.getListFnName = 'getList';
        this.tableService.context = this;
        //  Init Key
        this.invoiceKeyService.watchContext.next({ context: this, service: this._hotkeysService });

    }

    ngOnInit() {
        //  Init Fn
        this.listMaster['listFilter'] = [{ value: false, name: 'Date Filter' }];
        this.listMaster['dateType'] = [{ id: 0, name: 'Payment Date' }, { id: 1, name: 'Creadted On' }, { id: 2, name: 'Updated On' }];
        this.listMaster['electType'] = [{ id: 0, name: 'No' }, { id: 1, name: 'Yes' }];
        this.listMaster['status'] = [
            { id: 1, name: 'New' },
            { id: 2, name: 'Submitted' },
            { id: 3, name: 'Rejected' },
            { id: 4, name: 'Approved' },
            { id: 5, name: 'Partially Paid' },
            { id: 6, name: 'Fully Paid' },
            { id: 7, name: 'Canceled' },
            { id: 8, name: 'Overdue' }
        ];
        this.listMaster['inv_type'] = [
            { id: 1, name: 'Sales Order' }
        ];
        // this.getListInvoiceItemsRef();

        this.getList();
        this.getCountStatus();
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
    filter(status) {
        const params = { status };
        this.financialService.getListInvoice(params).subscribe(res => {
            try {
                this.list.items = res.data.rows;
                this.tableService.matchPagingOption(res.data);
            } catch (e) {
                console.log(e);
            }
        });
    }

    getListStatus() {
        this.financialService.getInvoiceStatus().subscribe(res => {
            this.listMaster['status'] = res.data.status;
        });
    }

    getCountStatus() {
        this.financialService.countInvoiceStatus().subscribe(res => {
            res.data.map(item => {
                if (this.statusConfig[item.name]) {
                    this.statusConfig[item.name].count = item.count;
                    this.statusConfig[item.name].status = this.statusConfig[item.name].id;
                }
            });
            this.listMaster['count-status'] = Object.keys(this.statusConfig).map(key => {
                return this.statusConfig[key];
            });
        });
    }

    updateStatus(id, status) {
        const params = { status };
        this.financialService.updateInvoiceStatus(id, params).subscribe(res => {
            try {
                this.toastr.success(res.message);
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

    sendMail(id) {
        const modalRef = this.modalService.open(ReceiptMailModalComponent, { size: 'lg', windowClass: 'modal-md' });
        modalRef.result.then(res => {
        }, dismiss => { });
        modalRef.componentInstance.invoiceId = id;
    }

    moreFilter() {
        this.onoffFilter = !this.onoffFilter;
    }

    onFilterChanged(value) {
        if (!value) {
            this.searchForm.patchValue({
                'inv_dt_from': null,
                'inv_dt_to': null,
                'inv_due_dt_from': null,
                'inv_due_dt_to': null
            });
        }
    }

    onDateTypeChanged() {
        this.searchForm.patchValue({
            'inv_dt_from': null,
            'inv_dt_to': null,
            'inv_due_dt_from': null,
            'inv_due_dt_to': null
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

        this.financialService.getListInvoice(params).subscribe(res => {
            try {
                this.list.items = res.data.rows;
                this.appendItemsToInvoice();
                this.tableService.matchPagingOption(res.data);
            } catch (e) {
                console.log(e);
            }
        });
    }

    createInvoice() {
        this.router.navigate(['/financial/receipt-voucher/create']);
    }

    viewInvoice(id?) {
        if (id) {
            this.router.navigate(['/financial/receipt-voucher/view', id]);
        } else {
            const selectedInvoiceId = this.list.items[this.selectedIndex].id;
            if (selectedInvoiceId) {
                this.router.navigate(['/financial/receipt-voucher/view', selectedInvoiceId]);
            }
        }
    }

    editInvoice(id?) {
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

    getListInvoiceItemsRef() {
        this.financialService.getListInvoiceItemsRef().subscribe(res => {
            try {
                this.listInvoiceItemsRef = res.data;
                this.getList();
            } catch (e) {
                console.log(e);
            }
        }, err => {
            this.getList();
        });
    }

    appendItemsToInvoice() {
        const listItems = this.list.items;
        const listItemsRef = this.listInvoiceItemsRef;
        for (const unit of listItems) {
            if (unit['id']) {
                unit['items_details'] = listItemsRef[unit['id']];
            }
        }
    }

    convertStatus(id, key) {
        const stt = this.listMaster[key].find(item => item.id === id);
        return stt.name;
    }

    printPDF(id, inv_num) {
        const path = 'receipt-voucher/print-pdf/';
        const url = `${environment.api_url}${path}${id}`;
        const headers: HttpHeaders = new HttpHeaders();
        // Check if Pdf exist
        this.http.get(url, {
            headers,
            responseType: 'blob',
        }).subscribe(res => {
            const newWindow = window.open(`assets/pdfjs/web/viewer.html?openFile=false&encrypt=true&fileName=${inv_num}.pdf&file=${btoa(url)}`, '_blank');
            newWindow.document.title = inv_num;
            newWindow.focus();
        });
    }

    cancelInvoice(item?) {
        const selectedInvoiceId = item.id;
        const selectedInvoiceStatus = item.invoice_status_id;
        if (selectedInvoiceId && selectedInvoiceStatus === 1) {
            const modalRef = this.modalService.open(ConfirmModalContent);
            modalRef.componentInstance.message = 'Are you sure you want to cancel this invoice?';
            modalRef.componentInstance.yesButtonText = 'YES';
            modalRef.componentInstance.noButtonText = 'NO';
            modalRef.result.then(result => {
                if (result) {
                    const params = {
                        status_code: 'CC'
                    };
                    this.financialService.updateInvoiceStatus(selectedInvoiceId, params).subscribe(res => {
                        try {
                            if (res.status) {
                                this.toastr.success(res.message);
                                this.getList();
                            } else {
                                this.toastr.error(res.message, null, { enableHtml: true });
                            }
                        } catch (e) {
                            console.log(e);
                        }
                    }, err => {
                        this.toastr.error(err.message);
                    });
                }
            }, dismiss => { });
        }
    }

}
