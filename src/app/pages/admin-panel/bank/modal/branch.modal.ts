import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../../../services/common.service';
import { BankService } from '../bank.service';

import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { Helper } from '../../../../shared/helper/common.helper';
@Component({
  selector: 'app-branch-modal',
  templateUrl: './branch.modal.html',
  providers: [BankService, HotkeysService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BranchModalComponent implements OnInit, OnDestroy {
  // Resolve Data
  public branchForm: FormGroup;
  public listMaster = {};

  @Input() bankData;
  @Input() branchId;
  @Input() bankId;
  @Input() modalTitle;
  public data = {};

  constructor(public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private bankService: BankService,
    private commonService: CommonService,
    private cd: ChangeDetectorRef,
    private helper: Helper,
    public _hotkeysService: HotkeysService
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
    this.initKeyBoard();
  }

  refresh() {
     if (!this.cd['destroyed']) { this.cd.detectChanges(); }
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

    initKeyBoard() {
        this.data['key_config'] = {
            name: {
                element: null,
                focus: true,
            },
        };

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+f1', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            event.preventDefault();
            if (this.data['key_config'].name.element) {
                this.data['key_config'].name.element.nativeElement.focus();
            }
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Focus'));

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+o', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            this.ok();
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'OK'));

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+backspace', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            event.preventDefault();
            this.cancel();
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Cancel'));
    }

    resetKeys() {
        const keys = Array.from(this._hotkeysService.hotkeys);
        keys.map(key => {
            this._hotkeysService.remove(key);
        });
    }

    ngOnDestroy() {
        this.resetKeys();
    }
}
