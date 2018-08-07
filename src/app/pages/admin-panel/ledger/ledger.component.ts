import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-ledger',
  providers: [LedgerService, LedgerKeyService],
  templateUrl: 'ledger.component.html',
  styleUrls: ['ledger.component.scss'],
  animations: [routerTransition()]
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

  public accountList = [{
    id: 0,
    level: 0,
    name: 'General Ledge - Accounts',
    isRoot: true,
    children: [
      {
        id: 1, name: 'Account 1', level: 1, children: [
          { id: 3, name: 'Account Child 1', level: 2 }
        ]
      },
      { id: 2, name: 'Account 2', level: 1 },
    ]
  }];

  public numberMask = createNumberMask({
    allowDecimal: false,
    includeThousandsSeparator: false,
    allowLeadingZeroes: true,
    prefix: '',
    integerLimit: 6
  });


  constructor(
    private fb: FormBuilder,
    public tableService: TableService,
    private router: Router,
    private ledgerService: LedgerService,
    private modalService: NgbModal,
    private toastr: ToastrService,
    public keyService: LedgerKeyService,
  ) {

    this.generalForm = fb.group({
      'code': [null, Validators.required],
      'des': [null, Validators.required],
      'range_start': [null, Validators.required],
      'range_end': [null, Validators.required],
      'credit': [null, Validators.required],
      'note': [null],
    });

    this.generalDetailForm = fb.group({
      'code': [null, Validators.required],
      'des': [null, Validators.required],
      'range_start': [null, Validators.required],
      'range_end': [null, Validators.required],
      'credit': [null, Validators.required],
      'note': [null],
    });

    this.searchForm = fb.group({
      'no': [null],
      'des': [null],
      'sts': [null],
    });

    // Assign get list function name, override variable here
    this.tableService.getListFnName = 'getList';
    this.tableService.context = this;

    //  Init Key
    this.keyService.watchContext.next(this);
  }

  ngOnInit() {
    this.getList();
  }

  /**
   * Tree Account
   */
  selectItem(data) {
    this.data['selectedAccount'] = data;
    if (data.level === 0) {
      this.data['show'] = null;
    }

    if (data.level === 1) {
      this.data['show'] = this.screen.VIEW_ACCOUNT_TYPE;
      this.generalForm.patchValue(data);
    }
    if (data.level === 2) {
      this.data['show'] = this.screen.VIEW_DETAIL_TYPE;
      this.generalDetailForm.patchValue(data);
    }
  }

  actionInvoke(type) {
    this.generalDetailForm.reset();
    this.generalForm.reset();
    this.data['show'] = type;
  }

  /**
   * Table Event
   */

  selectData(index) {
  }

  /**
   * Internal Function
   */

  getList() {
    const params = { ...this.tableService.getParams(), ...this.searchForm.value };
    Object.keys(params).forEach((key) => (params[key] === null || params[key] === '') && delete params[key]);

    this.ledgerService.getListAccount(params).subscribe(res => {
      try {
        this.list.items = res.data.rows;
        this.tableService.matchPagingOption(res.data);
      } catch (e) {
        console.log(e);
      }
    });
  }


  updateAccount(id, params) {
    this.ledgerService.updateAccount(id, params).subscribe(res => {
      try {
        this.toastr.success(res.message);
        this.getList();
      } catch (e) {
        console.log(e);
      }
    });
  }

  cancel() {
    this.data['show'] = (this.data['show'] === this.screen.NEW_DETAIL_TYPE) ? this.screen.VIEW_ACCOUNT_TYPE : null;
  }

  deleteAccount(id) {
    const modalRef = this.modalService.open(ConfirmModalContent);
    modalRef.result.then(result => {
      if (result) {
        this.ledgerService.deleteAccount(id).subscribe(res => {
          try {
            this.toastr.success(res.message);
            this.getList();
          } catch (e) {
            console.log(e);
          }
        });
      }
    });
  }

  // Modal
  newAccount(flag?) {
    const modalRef = this.modalService.open(AccountModalComponent, { windowClass: 'md-modal' });
    modalRef.componentInstance.modalTitle = (flag) ? flag.name : 'Add New Account';
    modalRef.componentInstance.isEdit = flag;
    modalRef.componentInstance.item = flag || {};
    modalRef.result.then(data => {
      this.getList();
    },
      dismiss => { });
  }

}
