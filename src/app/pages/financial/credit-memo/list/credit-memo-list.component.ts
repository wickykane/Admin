import { Component, ElementRef, OnInit, Renderer, ViewChild, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TableService } from './../../../../services/table.service';

import { ConfirmModalContent } from '../../../../shared/modals/confirm.modal';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { routerTransition } from '../../../../router.animations';

import { CreditMemoListKeyService } from './keys.list.control';

import { SendMailDebitModalContent } from '../modals/send-email/send-mail.modal';

@Component({
    selector: 'app-credit-memo-list',
    templateUrl: './credit-memo-list.component.html',
    styleUrls: ['./credit-memo-list.component.scss'],
    animations: [routerTransition()],
    providers: [CreditMemoListKeyService]
})
export class CreditMemoListComponent implements OnInit {

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
        public keyService: CreditMemoListKeyService,
        public tableService: TableService,
        private renderer: Renderer) {

        this.searchForm = fb.group({
            dr_no: [null],
            customer: [null],
            status: [null],
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

        this.getTotalSummary();
        this.getListDebitMemo();
    }

    getTotalSummary() {
        this.totalSummary = {
            numberOfNew: '7',
            numberOfSubmit: '15',
            numberOfApproved: '4',
            numberOfRejected: '8',
            numberOfPartiallyPaid: '0',
            numberOfFullyPaid: '0',
            numberOfOverdue: '19',
            numberOfCanceled: '15',
        };
    }

    getListDebitMemo() {
        const params = { ...this.tableService.getParams(), ...this.searchForm.value };
        Object.keys(params).forEach((key) => (params[key] === null || params[key] === '') && delete params[key]);
    }

    onStartSearch() {
        this.renderer.invokeElementMethod(this.drNoInput.nativeElement, 'focus');
    }

    addNewDebitMemo() {}

    onSubmitDebitMemo() {
        const modalRef = this.modalService.open(ConfirmModalContent);
            modalRef.componentInstance.message = 'Are you sure that you want to submit the debit memo to approver?';
            modalRef.componentInstance.yesButtonText = 'YES';
            modalRef.componentInstance.noButtonText = 'NO';
            modalRef.result.then(yes => {
                if (yes) {
                }
            }, no => { });
    }

    onApproveDebitMemo() {
        const modalRef = this.modalService.open(ConfirmModalContent);
            modalRef.componentInstance.message = 'Are you sure that you want to approve the debit memo?';
            modalRef.componentInstance.yesButtonText = 'YES';
            modalRef.componentInstance.noButtonText = 'NO';
            modalRef.result.then(yes => {
                if (yes) {
                }
            }, no => { });
    }

    onCancelDebitMemo() {
        const modalRef = this.modalService.open(ConfirmModalContent);
            modalRef.componentInstance.message = 'Are you sure that you want to cancel the debit memo?';
            modalRef.componentInstance.yesButtonText = 'YES';
            modalRef.componentInstance.noButtonText = 'NO';
            modalRef.result.then(yes => {
                if (yes) {
                }
            }, no => { });
    }

    onRejectDebitMemo() {
        const modalRef = this.modalService.open(ConfirmModalContent);
            modalRef.componentInstance.message = 'Are you sure that you want to reject the debit memo?';
            modalRef.componentInstance.yesButtonText = 'YES';
            modalRef.componentInstance.noButtonText = 'NO';
            modalRef.result.then(yes => {
                if (yes) {
                }
            }, no => { });
    }

    onReopenDebitMemo() {
        const modalRef = this.modalService.open(ConfirmModalContent);
            modalRef.componentInstance.message = 'Are you sure that you want to re-open the debit memo?';
            modalRef.componentInstance.yesButtonText = 'YES';
            modalRef.componentInstance.noButtonText = 'NO';
            modalRef.result.then(yes => {
                if (yes) {
                }
            }, no => { });
    }

    onViewDebitMemo() {}

    onEditDebitMemo() {}

    onPrintDebitMemo() {}

    onReceivePayment() {}

    onSendMail() {
        const modalRef = this.modalService.open(SendMailDebitModalContent, {
            size: 'lg'
        });
        modalRef.result.then(res => {
        }, dismiss => {});
    }
}
