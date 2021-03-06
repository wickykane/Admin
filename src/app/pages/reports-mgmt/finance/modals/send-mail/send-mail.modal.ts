import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

import { HotkeysService } from 'angular2-hotkeys';

declare var jQuery: any;
@Component({
    selector: 'app-customer-report-send-mail-modal-content',
    templateUrl: './send-mail.modal.html',
    providers: [NgbModal],
    styleUrls: ['./send-mail.modal.scss']
})
// tslint:disable-next-line:component-class-suffix
export class SendMailModalContent implements OnInit {

    public mailForm: FormGroup;

    public listMaster = {
        reportTypes: [
            {
                value: 'Excel'
            },
            {
                value: 'PDF'
            }
        ]
    };

    // public mailContent = {
    //     'cc': '',
    //     'subject': '',
    //     'body': '',
    //     'type': 'PDF'
    // };

    constructor(
        private fb: FormBuilder,
        private cd: ChangeDetectorRef,
        public activeModal: NgbActiveModal,
        private modalService: NgbModal,
        private toastr: ToastrService,
        private _hotkeysService: HotkeysService,
    ) {
        this.mailForm = fb.group({
            'cc': [null, Validators.required],
            'subject': [null],
            'body': [null],
            'type': ['PDF']
        });
    }

    ngOnInit() {
    }

    onSendMail() {
        // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // if (emailRegex.test(this.mailForm.value.cc)) {
        this.activeModal.close(this.mailForm.value);
        // } else {
        //     this.toastr.error('Email is invalid!');
        // }

        // this.activeModal.close(this.mailContent);
    }
}
