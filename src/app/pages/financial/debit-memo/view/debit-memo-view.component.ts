import { Component, ElementRef, OnInit, Renderer, ViewChild, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HotkeysService } from 'angular2-hotkeys';
import { TableService } from './../../../../services/table.service';

import { ConfirmModalContent } from '../../../../shared/modals/confirm.modal';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { routerTransition } from '../../../../router.animations';

import { DebitMemoService } from '../debit-memo.service';
import { DebitMemoViewKeyService } from './keys.view.controls';
@Component({
    selector: 'app-debit-memo-view',
    templateUrl: './debit-memo-view.component.html',
    styleUrls: ['./debit-memo-view.component.scss'],
    animations: [routerTransition()],
    providers: [DebitMemoService, DebitMemoViewKeyService]
})
export class DebitMemoViewComponent implements OnInit {

    public debitId = null;
    public debitDetail = {
        bill_addr: {},
        ship_addr: {},
        carrier: {},
        sts_name: '',
        line_items: []
    };
    @ViewChild('tabSet') tabSet;
    public data = {};

    constructor(public router: Router,
        private route: ActivatedRoute,
        public fb: FormBuilder,
        public toastr: ToastrService,
        private vRef: ViewContainerRef,
        private modalService: NgbModal,
        public tableService: TableService,
        public debitService: DebitMemoService,
        private keyService: DebitMemoViewKeyService,
        private _hotkeysService: HotkeysService,
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
                    this.debitDetail['paid_amount'] = (this.debitDetail['total_price'] - this.debitDetail['balance_price']) || 0;
                } catch (err) {
                    console.log(err);
                }
            }, err => {
                console.log(err);
            }
        );
    }

    selectTab(id) {
        this.tabSet.select(id);
    }

    cancel() {
        this.router.navigate(['/financial/debit-memo']);
    }
}
