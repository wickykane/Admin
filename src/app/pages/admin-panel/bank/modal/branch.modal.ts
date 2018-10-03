import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../../../services/common.service';
import { BankService } from '../bank.service';

@Component({
  selector: 'app-branch-modal',
  templateUrl: './branch.modal.html',
  providers: [BankService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BranchModalComponent implements OnInit {
  // Resolve Data
  public branchForm: FormGroup;
  public listMaster = {};

  @Input() bankData;
  @Input() branchId;
  @Input() bankId;
  @Input() modalTitle;

  constructor(public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private bankService: BankService,
    private commonService: CommonService,
    private cd: ChangeDetectorRef,
  ) {
    this.branchForm = fb.group({
      'bankname': [{ value: null, disabled: true }],
      'name': [null, Validators.required],
      'country_code': [null, Validators.required],
      'address': [null, Validators.required],
      'city': [null, Validators.required],
      'state_id': [null],
      'zip_code': [null, Validators.required],
    });
  }

  ngOnInit() {
    this.branchForm.patchValue({ bankname: this.bankData['name'] });
    if (this.branchId && this.bankId) {
      this.getBranchDetail(this.bankId, this.branchId);
    }
    this.getListCountry();
  }

  refresh() {
    this.cd.detectChanges();
  }

  changeCountry() {
    const id = this.branchForm.value.country_code;
    const params = {
      country: id
    };
    this.getStateByCountry(params);
  }

  getBranchDetail(bankId, branchId) {
    this.bankService.getDetailBranch(bankId, branchId).subscribe(res => {
      try {
        this.branchForm.patchValue(res.data);
        this.changeCountry();
        this.refresh();
      } catch (e) {
        console.log(e);
      }
    });
  }

  getStateByCountry(params) {
    this.commonService.getStateByCountry(params).subscribe(res => {
      try {
        this.listMaster['state'] = res.data;
        this.refresh();
      } catch (e) {
        console.log(e);
      }
    });
  }

  getListCountry() {
    this.commonService.getListCountry().subscribe(res => {
      try {
        this.listMaster['countries'] = res.data;
        this.refresh();
      } catch (e) {
        console.log(e);
      }
    });
  }

  ok() {
    this.activeModal.close(this.branchForm.value);
  }

  cancel() {
    this.activeModal.dismiss();
  }
}
