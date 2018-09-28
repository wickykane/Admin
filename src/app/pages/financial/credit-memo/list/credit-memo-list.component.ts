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
import { ConfirmModalContent } from '../../../../shared/modals/confirm.modal';
import { CreditMemoService } from '../credit-memo.service';
import { CreditMailModalComponent } from '../modals/send-email/mail.modal';


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

    public listMaster = {};
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
        private modalService: NgbModal,
        private _hotkeysService: HotkeysService,
        public creditMemoListKeyService: CreditMemoListKeyService,
        private http: HttpClient,
        private cd: ChangeDetectorRef,
        private renderer: Renderer) {

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
    refresh() {
        this.cd.detectChanges();
    }
    filter(sts) {
        const params = { sts };
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
        const params = { ...this.tableService.getParams(), ...this.searchForm.value };

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
        const headers: HttpHeaders = new HttpHeaders();
        this.http.get(url, {
            headers,
            responseType: 'blob',
        }).subscribe(res => {
            const file = new Blob([res], { type: 'application/pdf' });
            const fileURL = URL.createObjectURL(file);
            const newWindow = window.open(fileURL);
            newWindow.focus();
            newWindow.print();
        });
    }

    updateStatus(id, status) {
        const params = { credit_id: id, status };
        this.creditMemoService.updateCreditStatus(params).subscribe(res => {
            try {
                this.toastr.success(res.message);
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
}


