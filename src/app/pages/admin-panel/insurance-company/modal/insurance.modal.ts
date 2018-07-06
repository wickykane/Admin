import { Component, Input, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InsuranceService } from '../insurance.service';

@Component({
  selector: 'app-insurance-modal',
  templateUrl: './insurance.modal.html',
  providers: [InsuranceService]
})
export class InsuranceModalComponent implements OnInit {
  // Resolve Data
  public insuranceForm: FormGroup;
  @Input() item;

  constructor(public activeModal: NgbActiveModal, private fb: FormBuilder, private insuranceService: InsuranceService) {
    this.insuranceForm = fb.group({
      'code': [{ value: null, disabled: true }],
      'name': [null],
      'swift': [null],
    });
  }

  ngOnInit() {
    if (this.item.id) {
      this.getDetailInsurance(this.item.id);
    }
  }

  getDetailInsurance(id) {
    this.insuranceService.getDetailInsurance(id).subscribe((res) => {
      this.insuranceForm.patchValue(res.data);
    });
  }

  ok() {
    this.activeModal.close(this.insuranceForm.value);
  }

  cancel() {
    this.activeModal.dismiss();
  }
}
