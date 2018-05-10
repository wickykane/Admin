import { Component, Input, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-order-history-modal-content',
    templateUrl: './order-history.modal.html'
})
export class OrderHistoryModalContent implements OnInit {
    // Resolve Data
    @Input() name;
    @Input() detail;

    constructor(public activeModal: NgbActiveModal) { }

    ngOnInit() {
    }

}
