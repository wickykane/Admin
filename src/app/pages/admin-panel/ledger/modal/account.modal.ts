import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { LedgerService } from '../ledger.service';

@Component({
  selector: 'app-account-modal',
  templateUrl: './account.modal.html',
  styleUrls: ['../ledger.component.scss'],
  providers: [LedgerService]
})
export class AccountModalComponent implements OnInit {
  // Resolve Data
  public accountForm: FormGroup;
  public listMaster = {};
  @Input() item;
  @Input() modalTitle;
  @Input() isEdit;
  @ViewChild('select') select;
  public selectedParent = {};

  constructor(private toastr: ToastrService, private ledgerService: LedgerService, public activeModal: NgbActiveModal, private fb: FormBuilder) {
    this.accountForm = fb.group({
      'type': [null, Validators.required],
      'detail_type': [null, Validators.required],
      'no': [null, Validators.required],
      'des': [null, Validators.required],
      'credit': [null, Validators.required],
      'is_sub_acc': [null],
      'parent_id': [null],
      'sts': [null, Validators.required],
    });
  }

  ngOnInit() {
    this.listMaster['parents'] = [{
      id: 0,
      name: 'General Ledge - Accounts',
      isRoot: true,
      children: [
        { id: 1, name: 'Account 1' },
        { id: 2, name: 'Account 2' },
      ]
    }, {
      id: 4, name: 'TEST 01'
    },
    {
      id: 5, name: 'TEST 2 CHILD', children: [
        { id: 6, name: 'HEY?' }
      ]
    }];
    if (this.item.id) {
      this.getDetailAccount(this.item.id);
    }
  }

  getDetailAccount(id) {
    this.ledgerService.getDetailAccount(id).subscribe((res) => {
      this.accountForm.patchValue(res.data);
    });
  }

  ok() {
    this.activeModal.close(this.accountForm.value);
  }

  cancel() {
    this.activeModal.dismiss();
  }

  selectParent(event, item) {
    this.selectedParent = item;
    event.stopPropagation();
    this.accountForm.patchValue({ parent_id: this.listMaster['parents'][0].id });
    this.select.close();
  }


  createAccount(params) {
    this.ledgerService.createAccount(params).subscribe(res => {
      try {
        this.toastr.success(res.message);
      } catch (e) {
        console.log(e);
      }
    });
  }
}
