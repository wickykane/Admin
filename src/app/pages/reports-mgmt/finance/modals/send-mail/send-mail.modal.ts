import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
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

    @Input() type;

    constructor(
        private cd: ChangeDetectorRef,
        public activeModal: NgbActiveModal,
        private modalService: NgbModal,
        private toastr: ToastrService,
        private _hotkeysService: HotkeysService,
    ) {}

    ngOnInit() {
    }
}
