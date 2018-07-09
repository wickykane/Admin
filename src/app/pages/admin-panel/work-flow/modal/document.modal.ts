import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-promotion-modal-content',
  templateUrl: './document.modal.html'
})
// tslint:disable-next-line:component-class-suffix
export class DocumentModalContent implements OnInit {
  // Resolve Data

  public modalTitle = 'DOCUMENT';

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

  cancel() {

    this.activeModal.close();
  }
}
