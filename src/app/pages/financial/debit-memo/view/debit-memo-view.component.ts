import { Component, ElementRef, OnInit, Renderer, ViewChild, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TableService } from './../../../../services/table.service';

import { ConfirmModalContent } from '../../../../shared/modals/confirm.modal';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { routerTransition } from '../../../../router.animations';

@Component({
    selector: 'app-debit-memo-view',
    templateUrl: './debit-memo-view.component.html',
    styleUrls: ['./debit-memo-view.component.scss'],
    animations: [routerTransition()],
    providers: []
})
export class DebitMemoViewComponent implements OnInit {

    constructor(public router: Router,
        public fb: FormBuilder,
        public toastr: ToastrService,
        private vRef: ViewContainerRef,
        private modalService: NgbModal,
        public tableService: TableService,
        private renderer: Renderer) {
    }

    ngOnInit() {
    }
}
