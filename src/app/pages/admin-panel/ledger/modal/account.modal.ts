import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { LedgerService } from '../ledger.service';

@Component({
  selector: 'app-account-modal',
  templateUrl: './account.modal.html',
  styleUrls: ['../ledger.component.scss'],
  providers: [LedgerService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountModalComponent implements OnInit {
  // Resolve Data
  public accountForm: FormGroup;
  public listMaster = {};
  @Input() item;
  @Input() parent;
  @Input() modalTitle;
  @Input() isEdit;
  @ViewChild('select') select;
  public selectedParent = {};

  constructor(private toastr: ToastrService, private ledgerService: LedgerService, public activeModal: NgbActiveModal, private fb: FormBuilder,
    private cd: ChangeDetectorRef) {
    this.accountForm = fb.group({
      'type': [null],
      'detail_type': [null],
      'cd': [null, Validators.required],
      'des': [null, Validators.required],
      'credit': [null],
      'is_sub_acc': [null],
      'parent_id': [null],
      'ac': [1, Validators.required],
    });
  }

  ngOnInit() {
    if (this.parent) {
      this.accountForm.patchValue({
        type: this.parent.account_type_name,
        detail_type: this.parent.des,
        credit: (this.parent.credit) ? 'Credit' : 'Debit',
      });
    }

    this.listMaster['status'] = [
      { id: 0, value: 'Inactive' },
      { id: 1, value: 'Active' },
    ];

    this.getListParentAccount();

    if (this.item.id) {
      this.getDetailAccount(this.item.id);
    }
  }

  refresh() {
      this.cd.detectChanges();
  }

  changeSubAccount() {
    this.accountForm.patchValue({ parent_id: null });
  }

  getDetailAccount(id) {
    this.ledgerService.getDetailAccountById(id).subscribe((res) => {
      this.accountForm.patchValue({ ...res.data, is_sub_acc: (res.data.parent_id) ? 1 : 0 });
      this.refresh();
    });
  }

  ok() {
    if (this.item.id) {
      this.updateAccount();
    } else {
      this.createAccount();
    }
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

  getListParentAccount() {
    this.ledgerService.getListAccount(this.parent.id, {}).subscribe(res => {
      try {
        this.listMaster['parents'] = res.data;
        this.listMaster['parents'].forEach(item => {
          item.disabled = item.id === this.item.id;
        });
        this.listMaster['parents'] = this.listMaster['parents'].filter(item => item.level !== 2 );
        this.refresh();
      } catch (e) {
        console.log(e);
      }
    });
  }

  createAccount() {
    const params = this.accountForm.value;
    this.ledgerService.createAccount(this.parent.id, params).subscribe(res => {
      try {
        if (res.status) {
          this.toastr.success(res.message);
          this.refresh();
          this.activeModal.close(this.accountForm.value);
        } else {
          this.toastr.error(res.message);
        }
        this.refresh();
      } catch (e) {
        console.log(e);
      }
    });
  }

  updateAccount() {
    const params = this.accountForm.value;
    this.ledgerService.updateAccount(this.item.id, params).subscribe(res => {
      try {
        if (res.status) {
          this.toastr.success(res.message);
          this.refresh();
          this.activeModal.close(this.accountForm.value);
        } else {
          this.toastr.error(res.message);
        }
        this.refresh();
      } catch (e) {
        console.log(e);
      }
    });
  }
}
