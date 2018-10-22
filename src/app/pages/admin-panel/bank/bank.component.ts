import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HotkeysService } from 'angular2-hotkeys';
import { ToastrService } from 'ngx-toastr';
import { routerTransition } from '../../../router.animations';
import { TableService } from '../../../services/index';
import { ConfirmModalContent } from '../../../shared/modals/confirm.modal';
import { BankService } from './bank.service';
import { BankModalComponent } from './modal/bank.modal';
import { BranchModalComponent } from './modal/branch.modal';

import { cdArrowTable } from '../../../shared';
import { BankKeyService } from './keys.control';

@Component({
  selector: 'app-bank',
  providers: [BankService, BankKeyService],
  templateUrl: 'bank.component.html',
  styleUrls: ['./bank.component.scss'],
  animations: [routerTransition()],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class BankComponent implements OnInit {
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
    public keyService: BankKeyService, ) {
    this.searchForm = fb.group({
      'code': [null],
      'name': [null],
      'swift': [null],
    });

    // Assign get list function name, override variable here
    this.tableService.getListFnName = 'getList';
    this.tableService.context = this;
    //  Init Key
    this.keyService.watchContext.next({ context: this, service: this._hotkeysService });
  }

  ngOnInit() {
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

  getList() {
    const params = { ...this.tableService.getParams(), ...this.searchForm.value };
    Object.keys(params).forEach((key) => (params[key] === null || params[key] === '') && delete params[key]);

    this.bankService.getListBank(params).subscribe(res => {
      try {
        this.list.items = res.data.rows;
        this.tableService.matchPagingOption(res.data);
        this.refresh();
      } catch (e) {
        console.log(e);
      }
    });
  }

  createBank(params) {
    this.bankService.createBank(params).subscribe(res => {
      try {
        this.toastr.success(res.message);
        this.refresh();
        this.getList();
      } catch (e) {
        console.log(e);
      }
    });
  }

  updateBank(id, params) {
    this.bankService.updateBank(id, params).subscribe(res => {
      try {
        this.toastr.success(res.message);
        this.refresh();
        this.getList();
      } catch (e) {
        console.log(e);
      }
    });
  }

  deleteBank(id) {
    const modalRef = this.modalService.open(ConfirmModalContent);
    modalRef.result.then(result => {
      if (result) {
        this.bankService.deleteBank(id).subscribe(res => {
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
  editBank(flag?) {
    const modalRef = this.modalService.open(BankModalComponent, { windowClass: 'md-modal' });
    modalRef.componentInstance.modalTitle = (flag) ? 'EDIT BANK' : 'CREATE NEW BANK';
    modalRef.componentInstance.isEdit = flag;
    modalRef.componentInstance.item = flag || {};
    modalRef.result.then(data => {
      const params = { ...data };
      if (!flag) {
        this.createBank(params);
      } else {
        this.updateBank(flag.id, params);
      }
    },
      dismiss => { });
  }

  addBranch(item) {
    const modalRef = this.modalService.open(BranchModalComponent, { windowClass: 'md-modal' });
    modalRef.componentInstance.modalTitle = 'CREATE NEW BRANCH';
    modalRef.componentInstance.bankData = item || {};
    modalRef.result.then(data => {
      this.createBranch(item.id, data);
    },
      dismiss => { });
  }

  createBranch(bankId, params) {
    this.bankService.createBranch(bankId, params).subscribe(res => {
      try {
        this.toastr.success(res.message);
        this.refresh();
        this.getList();
      } catch (e) {
        console.log(e);
      }
    });
  }

    selectTable() {
        this.selectedIndex = 0;
        this.table.element.nativeElement.querySelector('td a').focus();
    }
}
