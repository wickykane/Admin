import { Component, Input, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-send-mail-debit-modal-content',
    templateUrl: './send-mail.modal.html',
    styleUrls: ['./send-mail.modal.scss']
})
// tslint:disable-next-line:component-class-suffix
export class SendMailDebitModalContent implements OnInit {


    constructor(public activeModal: NgbActiveModal,
            private toastr: ToastrService) {}

    ngOnInit() {}
}
