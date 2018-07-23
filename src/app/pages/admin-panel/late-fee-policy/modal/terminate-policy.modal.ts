import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-terminate-policy-modal',
    templateUrl: './terminate-policy.modal.html'
})
// tslint:disable-next-line:component-class-suffix
export class TerminatePolicyModalContent implements OnInit {
    @Input() message;

    constructor(public activeModal: NgbActiveModal) { }

    ngOnInit() { }
}
