import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { routerTransition } from '../../../router.animations';
import { TableService } from '../../../services/index';
import { ConfirmModalContent } from '../../../shared/modals/confirm.modal';
import { LedgerService } from './ledger.service';
import { AccountModalComponent } from './modal/account.modal';

import { LedgerKeyService } from './keys.control';

import { HotkeysService } from 'angular2-hotkeys';
import { cdArrowTable } from '../../../shared';
@Component({
  selector: 'app-ledger',
  providers: [LedgerService, LedgerKeyService],
  templateUrl: 'ledger.component.html',
  styleUrls: ['ledger.component.scss'],
  animations: [routerTransition()],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class LedgerComponent implements OnInit {
  /**
   *  Variable
   */
  public generalForm: FormGroup;
  public generalDetailForm: FormGroup;
  public searchForm: FormGroup;

  public listMaster = {};
  public selectedIndex = 0;

  public list = {
    items: []
  };

  public data = {};

  public screen = {
    NEW_ACCOUNT_TYPE: 'account-type',
    VIEW_ACCOUNT_TYPE: 'view_account-type',
    NEW_DETAIL_TYPE: 'detail-type',
    VIEW_DETAIL_TYPE: 'view-detaul-type',
  };


  public numberMask = createNumberMask({
    allowDecimal: false,
    includeThousandsSeparator: false,
    allowLeadingZeroes: true,
    prefix: '',
    integerLimit: 6
  });
  public isInstallQuickbook = false;
  @ViewChild('tabSet') tabSet;
  @ViewChild(cdArrowTable) table: cdArrowTable;
  constructor(
    private cd: ChangeDetectorRef,
    private fb: FormBuilder,
    public tableService: TableService,
    private router: Router,
    private ledgerService: LedgerService,
    private modalService: NgbModal,
    private toastr: ToastrService,
    public keyService: LedgerKeyService,
    private _hotkeysService: HotkeysService
  ) {

    this.generalForm = fb.group({
      'cd': [null, Validators.required],
      'des': [null, Validators.required],
      'range_start': [null, Validators.required],
      'range_end': [null, Validators.required],
      'is_credit': [null, Validators.required],
      'note': [null],
    });

    this.generalDetailForm = fb.group({
      'des': [null, Validators.required],
      'note': [null],
    });

    this.searchForm = fb.group({
      'cd': [null],
      'des': [null],
      'ac': [null],
    });

    // Assign get list function name, override variable here
    this.tableService.getListFnName = 'getList';
    this.tableService.context = this;

    //  Init Key
    this.keyService.watchContext.next({ context: this, service: this._hotkeysService });
  }

  ngOnInit() {
    this.getQuickbookSettings();
    this.getAccountTree();
    this.listMaster['expands'] = [];
    this.listMaster['status'] = [
      { id: 0, value: 'Inactive' },
      { id: 1, value: 'Active' },
    ];
  }
  refresh() {
       if (!this.cd['destroyed']) { this.cd.detectChanges(); }
  }

  /**
   * Tree Account
   */
  expand(items) {
    this.listMaster['expands'] = items;
  }

  getAccountTree() {
    this.ledgerService.getAccountTree().subscribe(res => {
      this.listMaster['account_list'] = [{ ...res.data, name: 'General Ledger - Accounts' }];
      this.refresh();
    });
  }

  getAccountTypeById(id, flag?) {
    this.ledgerService.getAccountTypeById(id).subscribe(res => {
      this.generalForm.patchValue(res.data);
      this.data['selectedAccount'] = (flag) ? res.data : this.data['selectedAccount'];
      this.data['selectedAccount']['is_credit'] = res.data.is_credit;
      this.refresh();
    });
  }

  getDetailAccountTypeById(id, flag?) {
    this.ledgerService.getDetailAccountTypeById(id).subscribe(res => {
      this.generalDetailForm.patchValue(res.data);
      this.data['selectedAccount'] = (flag) ? res.data : this.data['selectedAccount'];
      this.data['selectedAccount']['is_credit'] = res.data.is_credit;
      this.data['selectedAccount']['account_type_name'] = res.data.account_type_name;
      this.refresh();
    });
  }

  getDetailAccountById(id, flag?) {
    this.ledgerService.getDetailAccountById(id).subscribe(res => {
      this.generalDetailForm.patchValue(res.data);
      this.data['selectedAccount'] = (flag) ? res.data : this.data['selectedAccount'];
      this.data['selectedAccount']['is_credit'] = res.data.is_credit;
      this.refresh();
    });
  }

  getAccountCode() {
    this.ledgerService.getAccountCode().subscribe(res => {
      this.generalForm.patchValue({ cd: res.data });
      this.refresh();
    });
  }

  selectItem(data) {
    this.data['selectedAccount'] = data;
    if (data.level === 0) {
      this.data['show'] = null;
    }

    if (data.level === 1) {
      this.data['show'] = this.screen.VIEW_ACCOUNT_TYPE;
      this.getAccountTypeById(data.id);
    }
    if (data.level === 2) {
      this.data['show'] = this.screen.VIEW_DETAIL_TYPE;
      this.getDetailAccountTypeById(data.id);
      this.getList();
    }
  }

  actionInvoke(type) {
    this.generalDetailForm.reset();
    this.generalForm.reset();
    this.data['show'] = type;
    if (type === this.screen.NEW_ACCOUNT_TYPE) {
      this.getAccountCode();
    }
  }

  saveAccountType() {
    const params = this.generalForm.value;
    if (this.data['show'] === this.screen.NEW_ACCOUNT_TYPE) {
      this.ledgerService.createAccountType(params).subscribe(res => {
        if (res.status) {
          this.toastr.success(res.message);
          this.getAccountTree();
          this.selectItem({...res.data, level: 1});
          this.data['selectedAccount']['name'] = this.generalForm.value.des + '(' + this.generalForm.value.range_start + '-' + this.generalForm.value.range_end + ')';
        } else {
          this.toastr.error(res.message);
        }
        this.refresh();
      });
    } else {
      const id = this.data['selectedAccount'].id;
      this.ledgerService.updateAccountType(id, params).subscribe(res => {
        if (res.status) {
          this.toastr.success(res.message);
          this.getAccountTree();
          this.data['selectedAccount']['name'] = this.generalForm.value.des + '(' + this.generalForm.value.range_start + '-' + this.generalForm.value.range_end + ')';
        } else {
          this.toastr.error(res.message);
        }
        this.refresh();
      });
    }
    this.cd.detectChanges();
  }

  saveDetailAccountType() {
    const params = this.generalDetailForm.value;
    params['account_type_id'] = this.data['selectedAccount'].id;

    if (this.data['show'] === this.screen.NEW_DETAIL_TYPE) {
      this.ledgerService.createDetailAccountType(params).subscribe(res => {
        if (res.status) {
          this.toastr.success(res.message);
          this.getAccountTree();
          this.selectItem({...res.data, level: 2});
          this.data['selectedAccount']['des'] = this.generalDetailForm.value.des;
        } else {
          this.toastr.error(res.message);
        }
        this.refresh();
      });
    } else {
      const id = this.data['selectedAccount'].id;
      this.ledgerService.updateDetailAccountType(id, params).subscribe(res => {
        if (res.status) {
          this.toastr.success(res.message);
          this.getAccountTree();
          this.data['selectedAccount']['des'] = this.generalDetailForm.value.des;
        } else {
          this.toastr.error(res.message);
        }
        this.refresh();
      });
    }
    this.cd.detectChanges();
  }

  /**
   * Table Event
   */

  selectData(index) {
  }

  /**
   * Internal Function
   */

    getQuickbookSettings() {
        this.ledgerService.getSettingInfoQuickbook().subscribe(
            res => {
                this.isInstallQuickbook = res.data.state === 'authorized' ? true : false;
            }, err => {}
        );
    }
  getList() {
    const params = { ...this.searchForm.value };
    Object.keys(params).forEach((key) => (params[key] === null || params[key] === '') && delete params[key]);

    this.ledgerService.getListAccount(this.data['selectedAccount'].id, params).subscribe(res => {
      try {
        this.list.items = res.data.filter(item => {
          for (const key in params) {
            if ((String(item[key]).toLowerCase()).indexOf(String(params[key]).trim().toLowerCase()) === -1) {
              return false;
            }
          }
          return true;
        });
        this.refresh();
      } catch (e) {
        console.log(e);
      }
    });
  }


  updateAccount(id, params) {
    this.ledgerService.updateAccountType(id, params).subscribe(res => {
      try {
        this.toastr.success(res.message);
        this.getList();
        this.refresh();
      } catch (e) {
        console.log(e);
      }
    });
  }

  cancel() {
    this.data['show'] = (this.data['show'] === this.screen.NEW_DETAIL_TYPE) ? this.screen.VIEW_ACCOUNT_TYPE : null;
    this.cd.detectChanges();
  }

  deleteAccount(id) {
    const modalRef = this.modalService.open(ConfirmModalContent);
    modalRef.result.then(result => {
      if (result) {
        this.ledgerService.deleteAccount(id).subscribe(res => {
          try {
            this.toastr.success(res.message);
            this.getList();
            this.refresh();
          } catch (e) {
            console.log(e);
          }
        });
      }
    });
  }

  // Modal
  newAccount(flag?) {
    this.keyService.saveKeys();
    const modalRef = this.modalService.open(AccountModalComponent, { windowClass: 'md-modal' });
    modalRef.componentInstance.modalTitle = (flag) ? flag.des : 'Add New Account';
    modalRef.componentInstance.isEdit = flag;
    modalRef.componentInstance.item = flag || {};
    modalRef.componentInstance.parent = this.data['selectedAccount'];
    modalRef.result.then(data => {
      if (this.keyService.keys.length > 0) {
        this.keyService.reInitKey();
        this.table.reInitKey(this.data['tableKey']);
    }
      this.getList();
    },
      dismiss => {
        if (this.keyService.keys.length > 0) {
          this.keyService.reInitKey();
          this.table.reInitKey(this.data['tableKey']);
      }
       });
  }

  syncToQuickbook() {
    if (this.isInstallQuickbook) {
        this.ledgerService.syncLedgerAccountToQuickbook().subscribe(
            _res => {
                try {
                    const result = JSON.parse(_res['_body']);
                    this.toastr.success(`Ledger Account has been sync to Quickbooks successfully.`);
                } catch (err) {}
            },
            err => {}
        );
    }
  }
  back() {
    this.router.navigate(['/admin-panel']);
}
selectTab(step) {
  let active = 0;
  active = +this.tabSet.activeId;
  active += step;
  active = Math.min(Math.max(active, 0), 7);
  this.tabSet.select(String(active));
  this.cd.detectChanges();
}
selectTable() {
  this.selectedIndex = 0;
  this.table.element.nativeElement.querySelector('td').focus(); this.refresh();
}
}
