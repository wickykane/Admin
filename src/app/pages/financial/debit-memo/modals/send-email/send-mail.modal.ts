import { Component, Input, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

import { DebitMemoService } from '../../debit-memo.service';

@Component({
    selector: 'app-send-mail-debit-modal-content',
    templateUrl: './send-mail.modal.html',
    styleUrls: ['./send-mail.modal.scss'],
    providers: [DebitMemoService]
})
// tslint:disable-next-line:component-class-suffix
export class SendMailDebitModalContent implements OnInit {

    @Input() debitId = null;

    public mailForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        private toastr: ToastrService,
        public activeModal: NgbActiveModal,
        public debitService: DebitMemoService) {
            this.mailForm = fb.group({
                'send_to': [null, Validators.required],
                'subject': [null],
                'content': [null],
            });
    }

    ngOnInit() {}

    ok() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(this.mailForm.value.send_to)) {
            this.onSendMail();
        } else {
            this.mailForm.value.send_to ? this.toastr.error('Email is invalid!') : this.toastr.error('Email is empty!');
        }
    }

    onSendMail() {
        const params = this.mailForm.value;
        this.debitService.sendMail(this.debitId, params).subscribe(res => {
            try {
                this.toastr.success(res.message);
                this.activeModal.close(this.mailForm.value);
            } catch (err) {
                console.log(err);
            }
        }, err => {
            console.log(err);
        });
    }

    cancel() {
        this.activeModal.dismiss();
    }
}
