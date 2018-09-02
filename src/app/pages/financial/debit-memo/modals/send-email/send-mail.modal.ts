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

    public emailInfor = {
        send_to: '',
        subject: '',
        content: ''
    };

    constructor(
        public activeModal: NgbActiveModal,
        private toastr: ToastrService,
        public debitService: DebitMemoService) {}

    ngOnInit() {}

    sendEmail() {
        console.log('Debit Id: ', this.debitId);
        console.log('Email: ', this.emailInfor);
        // this.debitService.sendMail(this.debitId, this.sendEmail).subscribe(
        //     res => {
        //         try {
        //             this.toastr.success(res.message);
        //             this.activeModal.close();
        //         } catch (err) {
        //             console.log(err);
        //         }
        //     }, err => {
        //         console.log(err);
        //     }
        // );
    }
}
