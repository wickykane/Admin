import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'terminate-policy-modal',
    templateUrl: './terminate-policy.modal.html'
})
export class TerminatePolicyModalContent implements OnInit {
    @Input() message;

    constructor(public activeModal: NgbActiveModal) { }

    ngOnInit() { }
}
