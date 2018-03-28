import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'confirm-modal',
  templateUrl: './confirm.modal.html'
})
export class ConfirmModalContent  implements OnInit  {
    @Input() message;

    constructor(public activeModal: NgbActiveModal) {}

    ngOnInit() {}
}
