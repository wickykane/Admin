import { Component, ElementRef, OnInit, Renderer, ViewChild, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TableService } from './../../../../services/table.service';

import { ConfirmModalContent } from '../../../../shared/modals/confirm.modal';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { routerTransition } from '../../../../router.animations';

import { DebitMemoCreateKeyService } from './keys.create.control';

import { ItemsOrderDebitModalContent } from '../modals/items-order/items-order.modal';
import { MiscItemsDebitModalContent } from '../modals/misc-items/misc-items.modal';

@Component({
    selector: 'app-debit-memo-create',
    templateUrl: './debit-memo-create.component.html',
    styleUrls: ['./debit-memo-create.component.scss'],
    animations: [routerTransition()],
    providers: [DebitMemoCreateKeyService]
})
export class DebitMemoCreateComponent implements OnInit {

    public listMaster = {};

    public debitMemoForm: FormGroup;

    constructor(public router: Router,
        public fb: FormBuilder,
        public toastr: ToastrService,
        private vRef: ViewContainerRef,
        private modalService: NgbModal,
        public keyService: DebitMemoCreateKeyService,
        public tableService: TableService,
        private renderer: Renderer) {

        this.debitMemoForm = fb.group({
            customer: [null],
            contact: [null],
            phone: [null],
            email: [null],
            discount_lvl: [null],

            debt_no: [null],
            issue_date: [null],
            doc_type: [null],
            doc_no: [null],
            ac: [null],

            payment_method: [null],
            payment_term: [null],
            due_date: [null],
            sale_person: [null],
            approver: [null],

            bill_to: [null]
        });
        //  Init hot keys
        this.keyService.watchContext.next(this);
    }

    ngOnInit() {
    }

    openModalAddItemsOrder() {
        const modalRef = this.modalService.open(ItemsOrderDebitModalContent, {
            size: 'lg'
        });
        modalRef.result.then(res => {
        }, dismiss => {});
    }

    openModalAddMiscItems() {
        const modalRef = this.modalService.open(MiscItemsDebitModalContent, {
            size: 'lg'
        });
        modalRef.result.then(res => {
        }, dismiss => {});
    }
}
