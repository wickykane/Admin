import {Component, Input} from '@angular/core';

import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'promotion-modal-content',
  templateUrl: './promotion.modal.html' 
})
export class PromotionModalContent {
//Resolve Data
  @Input() name;

  constructor(public activeModal: NgbActiveModal) {}
}
