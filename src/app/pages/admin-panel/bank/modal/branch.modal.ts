import { Component, Input, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../../../services/common.service';
import { BankService } from '../bank.service';

@Component({
  selector: 'app-branch-modal',
  templateUrl: './branch.modal.html',
  providers: [BankService]
})
export class BranchModalComponent implements OnInit {
  // Resolve Data
  public branchForm: FormGroup;
  public listMaster = {};
  @Input() bankData;
  @Input() branchId;
  @Input() bankId;

  constructor(public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private bankService: BankService,
    private commonService: CommonService) {
    this.branchForm = fb.group({
      'bankname': [{ value: null, disabled: true }],
      'name': [null],
      'country_code': [null],
      'address': [null],
      'city': [null],
      'state_id': [null],
      'zip_code': [null],
    });
  }

  ngOnInit() {
    this.branchForm.patchValue({ bankname: this.bankData['name'] });
    if (this.branchId && this.bankId) {
      this.getBranchDetail(this.bankId, this.branchId);
    }
    this.getListCountry();
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
      } catch (e) {
        console.log(e);
      }
    });
  }

  getStateByCountry(params) {
    this.commonService.getStateByCountry(params).subscribe(res => {
      try {
        this.listMaster['state'] = res.data;
      } catch (e) {
        console.log(e);
      }
    });
  }

  getListCountry() {
    this.commonService.getListCountry().subscribe(res => {
      try {
        this.listMaster['countries'] = res.data;
      } catch (e) {
        console.log(e);
      }
    });
  }

  ok() {

  }

  cancel() {
    this.activeModal.dismiss();
  }
}
