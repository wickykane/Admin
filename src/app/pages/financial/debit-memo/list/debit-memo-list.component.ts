import { Component, ElementRef, OnInit, Renderer, ViewChild, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TableService } from './../../../../services/table.service';

import { ConfirmModalContent } from '../../../../shared/modals/confirm.modal';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { routerTransition } from '../../../../router.animations';

import { DebitMemoListKeyService } from './keys.list.control';

import { DebitMemoService } from '../debit-memo.service';

import { SendMailDebitModalContent } from '../modals/send-email/send-mail.modal';

@Component({
    selector: 'app-debit-memo-list',
    templateUrl: './debit-memo-list.component.html',
    styleUrls: ['./debit-memo-list.component.scss'],
    animations: [routerTransition()],
    providers: [DebitMemoListKeyService]
})
export class DebitMemoListComponent implements OnInit {

    @ViewChild('drNo') drNoInput: ElementRef;

    public listMaster = {};

    public searchForm: FormGroup;

    public listDebitMemo = [];

    public totalSummary = {};

    constructor(public router: Router,
        public fb: FormBuilder,
        public toastr: ToastrService,
        private vRef: ViewContainerRef,
        private modalService: NgbModal,
        public keyService: DebitMemoListKeyService,
        public tableService: TableService,
        public debitMemoService: DebitMemoService,
        private renderer: Renderer) {

        this.searchForm = fb.group({
            no: [null],
            company_name: [null],
            sts: [null],
            date_type: [null],
            date_from: [null],
            date_to: [null]
        });
        //  Init hot keys
        this.keyService.watchContext.next(this);

        this.tableService.getListFnName = 'getListDebitMemo';
        this.tableService.context = this;
    }

    ngOnInit() {
        this.listMaster['dateType'] = [
            { id: 0, name: 'Issue Date' },
            { id: 1, name: 'Due Date' }
        ];

        this.getDebitStatusList();
        this.getTotalSummary();
        this.getListDebitMemo();
    }

    getDebitStatusList() {
        this.debitMemoService.getDebitStatusList().subscribe(
            res => {
                try {
                    this.listMaster['status'] = res.data;
                } catch (err) {
                    console.log(err);
                }
            }, err => {
                console.log(err);
            }
        );
    }

    getTotalSummary() {
        this.debitMemoService.getDebitReportTotal().subscribe(
            res => {
                try {
                    this.totalSummary = {
                        numberOfNew: res.data[0] && (res.data[0]['total'] || 0),
                        numberOfSubmit: res.data[1] && (res.data[1]['total'] || 0),
                        numberOfApproved: res.data[2] && (res.data[2]['total'] || 0),
                        numberOfRejected: res.data[3] && (res.data[3]['total'] || 0),
                        numberOfPartiallyPaid: res.data[4] && (res.data[4]['total'] || 0),
                        numberOfFullyPaid: res.data[5] && (res.data[5]['total'] || 0),
                        numberOfOverdue: res.data[6] && (res.data[6]['total'] || 0),
                        numberOfCanceled: res.data[7] && (res.data[7]['total'] || 0)
                    };
                } catch (err) {
                    console.log(err);
                }
            }, err => {
                console.log(err);
            }
        );
    }

    getListDebitMemo() {
        const params = { ...this.tableService.getParams(), ...this.searchForm.value };

        switch (params['date_type']) {
            case 0: {
                params['issue_date_from'] = params['date_from'];
                params['issue_date_to'] = params['date_to'];
                break;
            }
            case 1: {
                params['due_date_from'] = params['date_from'];
                params['due_date_to'] = params['date_to'];
                break;
            }
        }
        delete params['date_type'];
        delete params['date_from'];
        delete params['date_to'];
        Object.keys(params).forEach((key) => (params[key] === null || params[key] === '') && delete params[key]);
        this.debitMemoService.getListDebitMemo(params).subscribe(
            res => {
                try {
                    this.listDebitMemo = res.data.rows;
                    this.tableService.matchPagingOption(res.data);
                } catch (err) {
                    console.log(err);
                }
            }, err => {
                console.log(err);
            }
        );
    }

    onStartSearch() {
        this.renderer.invokeElementMethod(this.drNoInput.nativeElement, 'focus');
    }

    addNewDebitMemo() {
        this.router.navigate(['/financial/debit-memo/create']);
    }

    onSubmitDebitMemo(debitId) {
        const modalRef = this.modalService.open(ConfirmModalContent);
            modalRef.componentInstance.message = 'Are you sure that you want to submit the debit memo to approver?';
            modalRef.componentInstance.yesButtonText = 'YES';
            modalRef.componentInstance.noButtonText = 'NO';
            modalRef.result.then(yes => {
                if (yes) {
                    this.updateDebitStatus(debitId, 2);
                }
            }, no => { });
    }

    onApproveDebitMemo(debitId) {
        const modalRef = this.modalService.open(ConfirmModalContent);
            modalRef.componentInstance.message = 'Are you sure that you want to approve the debit memo?';
            modalRef.componentInstance.yesButtonText = 'YES';
            modalRef.componentInstance.noButtonText = 'NO';
            modalRef.result.then(yes => {
                if (yes) {
                    this.updateDebitStatus(debitId, 3);
                }
            }, no => { });
    }

    onCancelDebitMemo(debitId) {
        const modalRef = this.modalService.open(ConfirmModalContent);
            modalRef.componentInstance.message = 'Are you sure that you want to cancel the debit memo?';
            modalRef.componentInstance.yesButtonText = 'YES';
            modalRef.componentInstance.noButtonText = 'NO';
            modalRef.result.then(yes => {
                if (yes) {
                    this.updateDebitStatus(debitId, 5);
                }
            }, no => { });
    }

    onRejectDebitMemo(debitId) {
        const modalRef = this.modalService.open(ConfirmModalContent);
            modalRef.componentInstance.message = 'Are you sure that you want to reject the debit memo?';
            modalRef.componentInstance.yesButtonText = 'YES';
            modalRef.componentInstance.noButtonText = 'NO';
            modalRef.result.then(yes => {
                if (yes) {
                    this.updateDebitStatus(debitId, 4);
                }
            }, no => { });
    }

    onReopenDebitMemo(debitId) {
        const modalRef = this.modalService.open(ConfirmModalContent);
            modalRef.componentInstance.message = 'Are you sure that you want to re-open the debit memo?';
            modalRef.componentInstance.yesButtonText = 'YES';
            modalRef.componentInstance.noButtonText = 'NO';
            modalRef.result.then(yes => {
                if (yes) {
                    this.updateDebitStatus(debitId, 1);
                }
            }, no => { });
    }

    onViewDebitMemo(debitId) {
        this.router.navigate(['/financial/debit-memo/view', debitId]);
    }

    onEditDebitMemo(debitId) {
        this.router.navigate(['/financial/debit-memo/edit', debitId]);
    }

    onPrintDebitMemo() {}

    onReceivePayment() {}

    onSendMail() {
        const modalRef = this.modalService.open(SendMailDebitModalContent, {
            size: 'lg'
        });
        modalRef.result.then(res => {
        }, dismiss => {});
    }

    updateDebitStatus(debitId, newStatus) {
        this.debitMemoService.updateDebitMemoStatus(debitId, newStatus).subscribe(
            res => {
                try {
                    this.toastr.success(res.message);
                } catch (err) {
                    console.log(err);
                }
            }, err => {
                console.log(err);
            }
        );
    }
}
