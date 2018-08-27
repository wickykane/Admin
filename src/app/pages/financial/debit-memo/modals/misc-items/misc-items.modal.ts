import { Component, Input, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-misc-items-modal-content',
    templateUrl: './misc-items.modal.html',
    styleUrls: ['./misc-items.modal.scss']
})
// tslint:disable-next-line:component-class-suffix
export class MiscItemsDebitModalContent implements OnInit {


    constructor(public activeModal: NgbActiveModal,
            private toastr: ToastrService) {}

    ngOnInit() {}
}
