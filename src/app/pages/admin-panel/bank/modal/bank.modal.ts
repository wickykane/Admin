import { Component, Input, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BankService } from '../bank.service';

@Component({
  selector: 'app-bank-modal',
  templateUrl: './bank.modal.html',
  providers: [BankService]
})
export class BankModalComponent implements OnInit {
  // Resolve Data
  public bankForm: FormGroup;
  @Input() item;

  constructor(public activeModal: NgbActiveModal, private fb: FormBuilder, private bankService: BankService) {
    this.bankForm = fb.group({
      'code': [{ value: null, disabled: true }],
      'name': [null],
      'swift': [null],
    });
  }

  ngOnInit() {
    if (this.item.id) {
      this.getDetailBank(this.item.id);
    }
  }

  getDetailBank(id) {
    this.bankService.getDetailBank(id).subscribe((res) => {
      this.bankForm.patchValue(res.data);
    });
  }

  ok() {
    this.activeModal.close(this.bankForm.value);
  }

  cancel() {
    this.activeModal.dismiss();
  }
}
