import { Component, EventEmitter, Input, OnInit, Output, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { ConfirmModalContent } from '../../../../../shared/modals/confirm.modal';
import { TableService } from './../../../../../services/table.service';


@Component({
    selector: 'app-debit-info-tab',
    templateUrl: './debit-information-tab.component.html',
    styleUrls: ['./debit-information-tab.component.scss'],
    providers: []
})
export class DebitInformationTabComponent implements OnInit {

    constructor(
        public toastr: ToastrService,
        public fb: FormBuilder,
        private vRef: ViewContainerRef,
        private router: Router,
        private modalService: NgbModal,
        public tableService: TableService) {
    }

    ngOnInit() {}
}
