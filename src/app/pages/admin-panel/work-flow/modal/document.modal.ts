import { Component, Input, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'promotion-modal-content',
  templateUrl: './document.modal.html'
})
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
