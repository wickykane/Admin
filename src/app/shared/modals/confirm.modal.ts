import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-confirm-modal',
    templateUrl: './confirm.modal.html',
    styleUrls: ['./site.modal.scss']
})
// tslint:disable-next-line:component-class-suffix
export class ConfirmModalContent implements OnInit {
    @Input() message;
    @Input() yesButtonText;
    @Input() noButtonText;

    constructor(public activeModal: NgbActiveModal) { }

    ngOnInit() { }
}
