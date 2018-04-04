import { Component, Input, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'invoice-modal-content',
    templateUrl: './invoice.modal.html'
})
export class InvoiceModalContent implements OnInit {
    //Resolve Data
    @Input() name;
    @Input() detail;

    constructor(public activeModal: NgbActiveModal) { }

    ngOnInit() {
    }

}
