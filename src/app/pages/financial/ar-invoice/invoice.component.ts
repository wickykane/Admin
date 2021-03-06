import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, Renderer, ViewChild, ViewContainerRef } from '@angular/core';
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
import { StorageService } from '../../../services/storage.service';
import { cdArrowTable } from '../../../shared/index';
import { OrderService } from '../../order-mgmt/order-mgmt.service';
import { InvoiceKeyService } from './keys.list.control';
import { MailModalComponent } from './modals/mail.modal';

@Component({
    selector: 'app-invoice',
    templateUrl: './invoice.component.html',
    styleUrls: ['./invoice.component.scss'],
    animations: [routerTransition()],
    providers: [InvoiceKeyService, HotkeysService, TableService],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvoiceComponent implements OnInit {
    public listMaster = {};
    public listInvoiceItemsRef = [];
    public selectedIndex = 0;
    public list = {
        items: []
    };
    public user: any;
    public onoffFilter: any;
    public dateType;

    searchForm: FormGroup;

    public messageConfig = {
        1: 'Are you sure that you want to reopen the current invoice?',
        2: 'Are you sure that you want to submit the invoice to approver?',
        7: 'Are you sure that you want to cancel current invoice?',
        4: 'Are you sure that you want to approve the current invoice?',
        3: 'Are you sure that you want to reject the current invoice?',
        11: 'Are you sure that you want to revise the current invoice?',
    };

    public isInstallQuickbook = false;

    public statusConfig = {
        'New': { color: 'blue', name: 'New', id: 1, img: './assets/images/icon/new.png' },
        'Submitted': { color: 'texas-rose', name: 'Submited', id: 2 },
        // 'Rejected': { color: 'magenta', name: 'Rejected', id: 3 },
        'Approved': { color: 'strong-green', name: 'Approved', id: 4, img: './assets/images/icon/approved.png' },
        'Partially Paid': { color: 'darkblue', name: 'Partially Paid', id: 5, img: './assets/images/icon/partial_delivered.png' },
        'Fully Paid': { color: 'lemon', name: 'Fully Paid', id: 6, img: './assets/images/icon/full_delivered.png' },
        'Canceled': { color: 'red', name: 'Canceled', id: 7, img: './assets/images/icon/cancel.png' },
        'Overdue': { color: 'bright-grey', name: 'Overdue', id: 8 },
        'Revised': { color: 'texas-rose', name: 'Revised', id: 11 },
    };
    @ViewChild(cdArrowTable) table: cdArrowTable;
    constructor(public router: Router,
        public fb: FormBuilder,
        private cd: ChangeDetectorRef,
        public toastr: ToastrService,
        public tableService: TableService,
        private financialService: FinancialService,
        private modalService: NgbModal,
        private _hotkeysService: HotkeysService,
        public invoiceKeyService: InvoiceKeyService,
        private http: HttpClient,
        private renderer: Renderer,
        private storage: StorageService) {

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
        this.listMaster['dateType'] = [{ id: 0, name: 'Invoice Date' }, { id: 1, name: 'Due Date' }];
        this.listMaster['inv_type'] = [
            { id: 1, name: 'Sales Order' }
        ];
        // this.getListInvoiceItemsRef();

        this.getQuickbookSettings();
        this.getList();
        this.getCountStatus();
        this.getListStatus();
        this.user = JSON.parse(localStorage.getItem('currentUser'));
        this.listMaster['permission'] = this.storage.getRoutePermission(this.router.url);
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
    refresh() {
        if (!this.cd['destroyed']) { this.cd.detectChanges(); }
    }

    filter(status) {
        this.listMaster['filter'] = { status };
        this.tableService.pagination['page'] = 1;
        this.getList();
    }

    getListStatus() {
        this.financialService.getInvoiceStatus().subscribe(res => {
            this.listMaster['status'] = res.data.status;
            this.refresh();
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
            this.refresh();
        });
    }

    getQuickbookSettings() {
        this.financialService.getSettingInfoQuickbook().subscribe(
            res => {
                this.isInstallQuickbook = res.data.state === 'authorized' ? true : false;
            }, err => { }
        );
    }

    updateStatus(id, status) {
        const params = { status };
        this.financialService.updateInvoiceStatus(id, params).subscribe(res => {
            try {
                this.toastr.success(res.message);
                if (+id === 11) {
                    this.editInvoice(id);
                }
                if (status === 4 && this.isInstallQuickbook) {
                    this.financialService.syncInvoiceToQuickbook(id).subscribe(
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
                }
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
        const modalRef = this.modalService.open(MailModalComponent, { size: 'lg', windowClass: 'modal-md' });
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
        const params = { ...this.tableService.getParams(), ...this.searchForm.value, ...this.listMaster['filter'] || {} };

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
                this.refresh();
            } catch (e) {
                console.log(e);
            }
        });
    }

    createInvoice() {
        this.router.navigate(['/financial/invoice/create']);
    }

    viewInvoice(id?) {
        if (id) {
            this.router.navigate(['/financial/invoice/view', id]);
        } else {
            const selectedInvoiceId = this.list.items[this.selectedIndex].id;
            if (selectedInvoiceId) {
                this.router.navigate(['/financial/invoice/view', selectedInvoiceId]);
            }
        }
    }

    editInvoice(id?) {
        if (id) {
            this.router.navigate(['/financial/invoice/edit', id]);
        } else {
            const selectedInvoiceId = this.list.items[this.selectedIndex].id;
            const selectedInvoiceStatus = this.list.items[this.selectedIndex].invoice_status_id;
            if (selectedInvoiceId && selectedInvoiceStatus === 1) {
                this.router.navigate(['/financial/invoice/edit', selectedInvoiceId]);
            }
        }
    }

    getListInvoiceItemsRef() {
        this.financialService.getListInvoiceItemsRef().subscribe(res => {
            try {
                this.listInvoiceItemsRef = res.data;
                this.getList();
                this.refresh();
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
        this.refresh();
    }

    convertStatus(id, key) {
        const stt = (this.listMaster[key] || []).find(item => item.id === id) || {};
        return stt.name;
    }

    printPDF(id, inv_num) {
        const path = 'ar-invoice/print-pdf/';
        let url = `${environment.api_url}${path}${id}`;
        const headers: HttpHeaders = new HttpHeaders({ 'Authorization': 'Bearer ' + localStorage.getItem('id_token') });
        // Check if Pdf exist
        this.http.get(url, {
            headers,
            responseType: 'blob',
        }).subscribe(res => {
            url = url.replace('print-pdf', 'print-pdf-inv');
            const newWindow = window.open(`assets/pdfjs/web/viewer.html?openFile=false&encrypt=true&fileName=${inv_num}.pdf&file=${btoa(url)}`, '_blank');
            newWindow.document.title = inv_num;
            newWindow.focus();
        });
    }
    selectTable() {
        this.selectedIndex = 0;
        this.table.element.nativeElement.querySelector('td a').focus();
        this.refresh();
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
