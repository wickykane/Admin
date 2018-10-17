import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BankService } from '../bank.service';

@Component({
  selector: 'app-bank-modal',
  templateUrl: './bank.modal.html',
  providers: [BankService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BankModalComponent implements OnInit {
  // Resolve Data
  public bankForm: FormGroup;
  @Input() item;
  @Input() modalTitle;
  @Input() isEdit;

  constructor(public activeModal: NgbActiveModal, private fb: FormBuilder, private bankService: BankService,
    private cd: ChangeDetectorRef) {
    this.bankForm = fb.group({
      'code': [{ value: null, disabled: true }],
      'name': [null, Validators.required],
      'swift': [null, Validators.required],
    });
  }

  ngOnInit() {
    if (this.item.id) {
      this.getDetailBank(this.item.id);
    }
  }

  refresh() {
       if (!this.cd['destroyed']) { this.cd.detectChanges(); }
  }

  getDetailBank(id) {
    this.bankService.getDetailBank(id).subscribe((res) => {
      this.bankForm.patchValue(res.data);
      this.refresh();
    });
  }

  ok() {
    this.activeModal.close(this.bankForm.value);
  }

  cancel() {
    this.activeModal.dismiss();
  }
}
