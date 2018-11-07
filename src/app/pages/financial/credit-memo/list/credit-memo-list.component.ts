import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, Renderer, ViewChild, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TableService } from '../../../../services/table.service';
import { CreditMemoListKeyService } from './keys.list.control';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HotkeysService } from 'angular2-hotkeys';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../../environments/environment';
import { routerTransition } from '../../../../router.animations';
import { StorageService } from '../../../../services/storage.service';
import { ConfirmModalContent } from '../../../../shared/modals/confirm.modal';
import { FinancialService } from '../../financial.service';
import { CreditMemoService } from '../credit-memo.service';
import { CreditMailModalComponent } from '../modals/send-email/mail.modal';

import { cdArrowTable } from '../../../../shared';
@Component({
    selector: 'app-credit-memo-list',
    templateUrl: './credit-memo-list.component.html',
    styleUrls: ['../credit-memo.component.scss'],
    animations: [routerTransition()],
    providers: [CreditMemoListKeyService, TableService],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreditMemoListComponent implements OnInit {
    /**
     * letiable Declaration
     */
    @ViewChild('drNo') drNoInput: ElementRef;
    @ViewChild(cdArrowTable) table: cdArrowTable;

    public listMaster = {};
    public selectedIndex = 0;
    public list = {
        items: []
    };
    public user: any;
    public onoffFilter: any;

    searchForm: FormGroup;

    public isInstallQuickbook = false;

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
        'AP': { color: 'strong-green', name: 'Approved', img: './assets/images/icon/approved.png' },
        'RJ': { color: 'magenta', name: 'Rejected' },
        'CC': { color: 'red', name: 'Canceled', img: './assets/images/icon/cancel.png' },
        'RD': { color: 'lemon', name: 'Refund Due' },
        'RF': { color: 'bright-grey', name: 'Refunded' },
    };

    constructor(public router: Router,
        public fb: FormBuilder,
        public toastr: ToastrService,
        public tableService: TableService,
        private creditMemoService: CreditMemoService,
        public financialService: FinancialService,
        private modalService: NgbModal,
        private _hotkeysService: HotkeysService,
        public creditMemoListKeyService: CreditMemoListKeyService,
        private http: HttpClient,
        private cd: ChangeDetectorRef,
        private renderer: Renderer,
        private storage: StorageService) {

        this.searchForm = fb.group({
            'credit_memo_num': [null],
            'customer_name': [null],
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
        this.listMaster['dateType'] = [{ id: 'issue_date', name: 'Issue Date' }, { id: 'updated_dt', name: 'Updated Date' }];
        this.getList();
        this.getQuickbookSettings();
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

    onStartSearch() {
        this.renderer.invokeElementMethod(this.drNoInput.nativeElement, 'focus');
    }

    filter(status) {
        this.listMaster['filter'] = { sts: status };
        this.tableService.pagination['page'] = 1;
        this.getList();
    }

    getListStatus() {
        this.creditMemoService.getListStatusCredit().subscribe(res => {
            try {
                this.listMaster['listStatus'] = res.data;
                this.refresh();
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

    getCountStatus() {
        this.creditMemoService.countCountStatus().subscribe(res => {
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
            this.refresh();
        });
    }

    getList() {
        this.getCountStatus();
        const params = { ...this.tableService.getParams(), ...this.searchForm.value, ...this.listMaster['filter'] || {} };

        Object.keys(params).forEach((key) => {
            if (params[key] instanceof Array) {
                params[key] = params[key].join(',');
            }
            // tslint:disable-next-line:no-unused-expression
            (params[key] === null || params[key] === '') && delete params[key];
        });
        Object.keys(params).forEach((key) => (params[key] === null || params[key] === '') && delete params[key]);

        this.creditMemoService.getListCreditMemo(params).subscribe(res => {
            try {
                this.list.items = res.data.rows;
                this.tableService.matchPagingOption(res.data);
                this.refresh();
            } catch (e) {
                console.log(e);
            }
        });
    }
    sendMail(id) {
        const modalRef = this.modalService.open(CreditMailModalComponent, { size: 'lg', windowClass: 'modal-md' });
        modalRef.result.then(res => {
        }, dismiss => { });
        modalRef.componentInstance.creditId = id;
    }

    printPDF(id) {
        const path = 'credit-memo/export-pdf/';
        const url = `${environment.api_url}${path}${id}`;
        const headers: HttpHeaders = new HttpHeaders({ 'Authorization': 'Bearer ' + localStorage.getItem('id_token') });
        this.http.get(url, {
            headers,
            responseType: 'blob',
        }).subscribe(res => {
            const newWindow = window.open(`assets/pdfjs/web/viewer.html?openFile=false&encrypt=true&fileName=CreditMemo.pdf&file=${btoa(url)}`, '_blank');
            newWindow.document.title = 'CreditMemo';
            newWindow.focus();
        });
    }

    updateStatus(id, status) {
        const params = { credit_id: id, status };
        this.creditMemoService.updateCreditStatus(params).subscribe(res => {
            try {
                this.toastr.success(res.message);
                if (status === 3 && this.isInstallQuickbook) {
                    this.financialService.syncCreditToQuickbook(id).subscribe(
                        _res => {
                            try {
                                const result = JSON.parse(_res['_body']);
                                this.toastr.success(`Credit Memo ${result.data[0].entity.DocNumber} has been sync to Quickbooks successfully.`);
                            } catch (err) { }
                        },
                        err => {
                            this.toastr.error(`Cannot sync Credit Memo to Quickbooks.`);
                        }
                    );
                }
                this.getList();
            } catch (e) {
                console.log(e);
            }
        });
    }

    reopentCredit(id) {
        this.creditMemoService.reopenCredit(id).subscribe(res => {
            try {
                this.toastr.success(res.message);
                this.getList();
            } catch (e) {
                console.log(e);
            }
        });
    }

    confirmModal(id, status) {
        console.log(status);
        const modalRef = this.modalService.open(ConfirmModalContent, { size: 'lg', windowClass: 'modal-md' });
        modalRef.result.then(res => {
            if (res) {
                if (status === 'RE-OPEN') {
                    this.reopentCredit(id);
                    return;
                }
                this.updateStatus(id, status);
            }
        }, dismiss => { });
        modalRef.componentInstance.message = this.messageConfig[status];
        modalRef.componentInstance.yesButtonText = 'Yes';
        modalRef.componentInstance.noButtonText = 'No';
    }

    addNewCreditMemo() {
        this.router.navigate(['/financial/credit-memo/create']);
    }

    viewCredit(id?) {
        if (id) {
            this.router.navigate(['/financial/credit-memo/view', id]);
        } else {
            const selectedcreditId = this.list.items[this.selectedIndex].id;
            if (selectedcreditId) {
                this.router.navigate(['/financial/credit-memo/view', selectedcreditId]);
            }
        }
    }

    editCredit(id?) {
        if (id) {
            this.router.navigate(['/financial/credit-memo/edit', id]);
        } else {
            const selectedcreditId = this.list.items[this.selectedIndex].id;
            const selectedInvoiceStatus = this.list.items[this.selectedIndex].invoice_status_id;
            if (selectedcreditId && selectedInvoiceStatus === 1) {
                this.router.navigate(['/financial/credit-memo/edit', selectedcreditId]);
            }
        }
    }

    selectTable() {
        this.selectedIndex = 0;
        this.table.element.nativeElement.querySelector('td a').focus(); this.refresh();
    }
}
