import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, Renderer, ViewChild, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TableService } from './../../../../services/table.service';

import { environment } from '../../../../../environments/environment';
import { ConfirmModalContent } from '../../../../shared/modals/confirm.modal';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { routerTransition } from '../../../../router.animations';
import { StorageService } from '../../../../services/storage.service';
import { NgbDateCustomParserFormatter } from '../../../../shared/helper/dateformat';

import { DebitMemoListKeyService } from './keys.list.control';

import { FinancialService } from '../../financial.service';
import { DebitMemoService } from '../debit-memo.service';

import { HotkeysService } from 'angular2-hotkeys';
import { SendMailDebitModalContent } from '../modals/send-email/send-mail.modal';

import { cdArrowTable } from '../../../../shared';
@Component({
    selector: 'app-debit-memo-list',
    templateUrl: './debit-memo-list.component.html',
    styleUrls: ['./debit-memo-list.component.scss'],
    animations: [routerTransition()],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [DebitMemoListKeyService, HotkeysService, { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }, TableService]
})
export class DebitMemoListComponent implements OnInit {

    @ViewChild('drNo') drNoInput: ElementRef;
    @ViewChild(cdArrowTable) table: cdArrowTable;

    public listMaster = {
        'count-status': []
    };

    public searchForm: FormGroup;
    public onoffFilter: any;
    public listDebitMemo = [];
    public totalSummary = {};
    public selectedIndex = 0;
    public currentuser = {};

    public statusConfig = {
        'New': { color: 'blue', name: 'New', id: 1, img: './assets/images/icon/new.png' },
        'Submitted': { color: 'texas-rose', name: 'Submited', id: 2 },
        'Approved': { color: 'strong-green', name: 'Approved', id: 3, img: './assets/images/icon/approved.png' },
        'Rejected': { color: 'magenta', name: 'Rejected', id: 4 },
        'Cancelled': { color: 'red', name: 'Cancelled', id: 5, img: './assets/images/icon/cancel.png' },
        'Partially Paid': { color: 'darkblue', name: 'Partially Paid', id: 6, img: './assets/images/icon/partial_delivered.png' },
        'Fully Paid': { color: 'lemon', name: 'Fully Paid', id: 7, img: './assets/images/icon/full_delivered.png' },
        'Overdue': { color: 'bright-grey', name: 'Overdue', id: 8 },
    };

    public isInstallQuickbook = false;

    constructor(public router: Router,
        public fb: FormBuilder,
        public toastr: ToastrService,
        private vRef: ViewContainerRef,
        private cd: ChangeDetectorRef,
        private modalService: NgbModal,
        private _hotkeysService: HotkeysService,
        public keyService: DebitMemoListKeyService,
        public tableService: TableService,
        public debitMemoService: DebitMemoService,
        public financialService: FinancialService,
        private http: HttpClient,
        private renderer: Renderer,
        private storage: StorageService) {

        this.searchForm = fb.group({
            no: [null],
            company_name: [null],
            sts: [null],
            date_type: [null],
            date_from: [null],
            date_to: [null]
        });
        //  Init hot keys
        this.keyService.watchContext.next({ context: this, service: this._hotkeysService });
        this.tableService.getListFnName = 'getListDebitMemo';
        this.tableService.context = this;
    }

    ngOnInit() {
        this.currentuser = JSON.parse(localStorage.getItem('currentUser'));
        this.listMaster['dateType'] = [
            { id: null, name: 'Issue Date' },
            { id: 1, name: 'Due Date' }
        ];
        this.getQuickbookSettings();
        this.getDebitStatusList();
        this.getListDebitMemo();
        this.getCountStatus();
        this.listMaster['permission'] = this.storage.getRoutePermission(this.router.url);
    }

    refresh() {
        if (!this.cd['destroyed']) { this.cd.detectChanges(); }
    }

    getQuickbookSettings() {
        this.financialService.getSettingInfoQuickbook().subscribe(
            res => {
                this.isInstallQuickbook = res.data.state === 'authorized' ? true : false;
            }, err => { }
        );
    }

    getDebitStatusList() {
        this.debitMemoService.getDebitStatusList().subscribe(
            res => {
                try {
                    this.listMaster['status'] = res.data;
                    this.refresh();
                } catch (err) {
                    console.log(err);
                }
            }, err => {
                console.log(err);
            }
        );
    }

    getCountStatus() {
        this.debitMemoService.getDebitReportTotal().subscribe(res => {
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

    getListDebitMemo() {
        const params = { ...this.tableService.getParams(), ...this.searchForm.value, ...this.listMaster['filter'] || {} };
        if (params['date_type']) {
            params['due_date_from'] = params['date_from'];
            params['due_date_to'] = params['date_to'];
        } else {
            params['issue_date_from'] = params['date_from'];
            params['issue_date_to'] = params['date_to'];
        }
        Object.keys(params).forEach((key) => {
            if (params[key] instanceof Array) {
                params[key] = params[key].join(',');
            }
            // tslint:disable-next-line:no-unused-expression
            (params[key] === null || params[key] === '' || key === 'date_type' || key === 'date_from' || key === 'date_to') && delete params[key];
        });
        // params.order = 'id';
        // params.sort = 'desc';
        this.debitMemoService.getListDebitMemo(params).subscribe(
            res => {
                try {
                    this.listDebitMemo = res.data.rows;
                    this.selectedIndex = 0;
                    this.tableService.matchPagingOption(res.data);
                    this.refresh();
                } catch (err) {
                    console.log(err);
                }
            }, err => {
                console.log(err);
            }
        );
    }

    filter(status) {
        this.listMaster['filter'] = { sts: status };
        this.tableService.pagination['page'] = 1;
        this.getListDebitMemo();
    }

    moreFilter() {
        this.onoffFilter = !this.onoffFilter;
    }

    onDateTypeChanged() {
        this.searchForm.patchValue({
            'issue_date_from': null,
            'issue_date_to': null,
            'due_date_from': null,
            'due_date_to': null
        });
    }

    onStartSearch() {
        this.renderer.invokeElementMethod(this.drNoInput.nativeElement, 'focus');
    }

    onChangeDebitStatus(debitId, newStatus) {
        let modalMessage = '';
        switch (newStatus) {
            case 1: {
                modalMessage = 'Are you sure that you want to reopen the current debit memo?';
                break;
            }
            case 2: {
                modalMessage = 'Are you sure that you want to submit this debit memo to approver?';
                break;
            }
            case 3: {
                modalMessage = 'Are you sure that you want to approve the current debit memo?';
                break;
            }
            case 4: {
                modalMessage = 'Are you sure that you want to reject the current debit memo?';
                break;
            }
            case 5: {
                modalMessage = 'Are you sure that you want to cancel current debit memo?';
                break;
            }
        }
        const modalRef = this.modalService.open(ConfirmModalContent);
        modalRef.componentInstance.message = modalMessage;
        modalRef.componentInstance.yesButtonText = 'YES';
        modalRef.componentInstance.noButtonText = 'NO';
        modalRef.result.then(yes => {
            if (yes) {
                this.updateDebitStatus(debitId, newStatus);
            }
        }, no => { });
    }

    addNewDebitMemo() {
        this.router.navigate(['/financial/debit-memo/create']);
    }

    onViewDebitMemo(debitId) {
        this.router.navigate(['/financial/debit-memo/view', debitId]);
    }

    onEditDebitMemo(debitId) {
        this.router.navigate(['/financial/debit-memo/edit', debitId]);
    }

    onPrintDebitMemo(debitId, debitNo) {
        const path = `debit/${debitId}/print-pdf`;
        const url = `${environment.api_url}${path}`;
        const headers: HttpHeaders = new HttpHeaders({ 'Authorization': 'Bearer ' + localStorage.getItem('id_token') });
        this.http.get(url, {
            headers,
            responseType: 'blob',
        }).subscribe(res => {
            const newWindow = window.open(`assets/pdfjs/web/viewer.html?openFile=false&encrypt=true&fileName=${debitNo}.pdf&file=${btoa(url)}`, '_blank');
            newWindow.document.title = debitNo;
            newWindow.focus();
        });
    }

    onReceivePayment() { }

    onSendMail(debitId) {
        const modalRef = this.modalService.open(SendMailDebitModalContent, { size: 'lg', windowClass: 'modal-md' });
        modalRef.componentInstance.debitId = debitId;
        modalRef.result.then(res => {
        }, dismiss => { });
    }

    updateDebitStatus(debitId, newStatus) {
        this.debitMemoService.updateDebitMemoStatus(debitId, newStatus).subscribe(
            res => {
                try {
                    this.toastr.success(res.message);
                    if (newStatus === 3 && this.isInstallQuickbook) {
                        this.financialService.syncDebitToQuickbook(debitId).subscribe(
                            _res => {
                                try {
                                    const result = JSON.parse(_res['_body']);
                                    this.toastr.success(`Debit Memo ${result.data[0].entity.DocNumber} has been sync to Quickbooks successfully.`);
                                } catch (err) { }
                            },
                            err => {
                                this.toastr.error(`Cannot sync Debit Memo to Quickbooks.`);
                            }
                        );
                    }
                    this.getListDebitMemo();
                    this.getCountStatus();
                } catch (err) {
                    console.log(err);
                }
            }, err => {
                console.log(err);
            }
        );
    }

    selectTable() {
        this.selectedIndex = 0;
        this.table.element.nativeElement.querySelector('td a').focus(); this.refresh();
    }
}
