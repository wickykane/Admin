import { Component, ElementRef, OnInit, Renderer, ViewChild, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TableService } from './../../../../services/table.service';

import { ConfirmModalContent } from '../../../../shared/modals/confirm.modal';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { routerTransition } from '../../../../router.animations';

import { DebitMemoService } from '../debit-memo.service';

@Component({
    selector: 'app-debit-memo-view',
    templateUrl: './debit-memo-view.component.html',
    styleUrls: ['./debit-memo-view.component.scss'],
    animations: [routerTransition()],
    providers: [DebitMemoService]
})
export class DebitMemoViewComponent implements OnInit {

    public debitId = null;
    public debitDetail = {};

    constructor(public router: Router,
        private route: ActivatedRoute,
        public fb: FormBuilder,
        public toastr: ToastrService,
        private vRef: ViewContainerRef,
        private modalService: NgbModal,
        public tableService: TableService,
        public debitService: DebitMemoService,
        private renderer: Renderer) {
    }

    ngOnInit() {
        this.debitId = this.route.snapshot.paramMap.get('id');
        this.getDebitDetail();
    }

    getDebitDetail() {
        this.debitService.getDebitMemoDetail(this.debitId).subscribe(
            res => {
                try {
                    this.debitDetail = res.data;
                } catch (err) {
                    console.log(err);
                }
            }, err => {
                console.log(err);
            }
        );
    }
}
