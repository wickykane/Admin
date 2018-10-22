import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HotkeysService } from 'angular2-hotkeys';
import { ToastrService } from 'ngx-toastr';
import { routerTransition } from '../../../../router.animations';
import { TableService } from '../../../../services/index';
import { ConfirmModalContent } from '../../../../shared/modals/confirm.modal';
import { BankService } from '../bank.service';
import { BranchModalComponent } from '../modal/branch.modal';

import { cdArrowTable } from '../../../../shared';
import { BranchKeyService } from './branch-keys.control';
@Component({
  selector: 'app-branch',
  providers: [BankService, BranchKeyService],
  templateUrl: 'branch.component.html',
  styleUrls: ['../bank.component.scss'],
  animations: [routerTransition()],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class BranchComponent implements OnInit {
  /**
   *  Variable
   */
  @ViewChild(cdArrowTable) table: cdArrowTable;
  public searchForm: FormGroup;
  public listMaster = {};
  public selectedIndex = 0;
  public list = {
    items: []
  };

  public data = {};
  constructor(
    private cd: ChangeDetectorRef,
    private fb: FormBuilder,
    public tableService: TableService,
    private activeRouter: ActivatedRoute,
    private router: Router,
    private bankService: BankService,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private _hotkeysService: HotkeysService,
    public keyService: BranchKeyService) {
    this.searchForm = fb.group({
      'branch_name': [null],
    });

    // Assign get list function name, override variable here
    this.tableService.getListFnName = 'getList';
    this.tableService.context = this;
    //  Init Key
    this.keyService.watchContext.next({ context: this, service: this._hotkeysService });
  }

  ngOnInit() {
    this.data['bank_id'] = this.activeRouter.snapshot.params['id'];
    this.getBankDetail(this.data['bank_id']);
    this.getList();
  }

  /**
   * Table Event
   */
  refresh() {
     if (!this.cd['destroyed']) { this.cd.detectChanges(); }
  }

  selectData(index) {
    console.log(index);
  }

  /**
   * Internal Function
   */

  getBankDetail(id) {
    this.bankService.getDetailBank(id).subscribe(res => {
      this.data['bankData'] = res.data;
      this.refresh();
    });
  }

  getList() {
    const params = { ...this.tableService.getParams(), ...this.searchForm.value };
    Object.keys(params).forEach((key) => (params[key] === null || params[key] === '') && delete params[key]);

    this.bankService.getListBranch(this.data['bank_id'], params).subscribe(res => {
      try {
        this.list.items = res.data.rows;
        this.tableService.matchPagingOption(res.data);
        this.refresh();
      } catch (e) {
        console.log(e);
      }
    });
  }

  createBranch(params) {
    this.bankService.createBranch(this.data['bank_id'], params).subscribe(res => {
      try {
        this.toastr.success(res.message);
        this.refresh();
        this.getList();
      } catch (e) {
        console.log(e);
      }
    });
  }

  updateBranch(bankId, branchId, params) {
    this.bankService.updateBranch(bankId, branchId, params).subscribe(res => {
      try {
        this.toastr.success(res.message);
        this.refresh();
        this.getList();
      } catch (e) {
        console.log(e);
      }
    });
  }

  deleteBranch(bankId, branchId) {
    const modalRef = this.modalService.open(ConfirmModalContent);
    modalRef.result.then(result => {
      if (result) {
        this.bankService.deleteBranch(bankId, branchId).subscribe(res => {
          try {
            this.toastr.success(res.message);
            this.refresh();
            this.getList();
          } catch (e) {
            console.log(e);
          }
        });
      }
    });
  }

  // Modal
  editBranch(branchId, flag?) {
    const modalRef = this.modalService.open(BranchModalComponent, { windowClass: 'md-modal' });
    modalRef.componentInstance.modalTitle = (flag) ? 'EDIT BRANCH' : 'CREATE NEW BRANCH';
    modalRef.componentInstance.branchId = branchId;
    modalRef.componentInstance.bankId = this.data['bank_id'];
    modalRef.componentInstance.bankData = this.data['bankData'] || {};

    modalRef.result.then(data => {
      const params = { ...data };
      if (!flag) {
        this.createBranch(params);
      } else {
        this.updateBranch(this.data['bank_id'], branchId, params);
      }
    },
      dismiss => { });
  }

  selectTable() {
      this.selectedIndex = 0;
      this.table.element.nativeElement.querySelector('td a').focus();
  }
}
