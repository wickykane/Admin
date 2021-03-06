import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HotkeysService } from 'angular2-hotkeys';
import { ToastrService } from 'ngx-toastr';
import { routerTransition } from '../../../router.animations';
import { TableService } from '../../../services/index';
import { ConfirmModalContent } from '../../../shared/modals/confirm.modal';
import { PayTermKeyService } from './keys.control';
import { PaymentTermService } from './payterm.service';

import { StorageService } from '../../../services/storage.service';
import { cdArrowTable } from '../../../shared';

@Component({
  selector: 'app-payterm',
  providers: [PaymentTermService, PayTermKeyService],
  templateUrl: 'payterm.component.html',
  styleUrls: ['./payterm.component.scss'],
  animations: [routerTransition()],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class PaymentTermComponent implements OnInit {
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
    private paymentTerm: PaymentTermService,
    public keyService: PayTermKeyService,
    private _hotkeysService: HotkeysService,
    private modalService: NgbModal,
    private storage: StorageService,
    private toastr: ToastrService) {
    this.searchForm = fb.group({
      'ac': [null],
      'des': [null]
    });

    // Assign get list function name, override variable here
    this.tableService.getListFnName = 'getList';
    this.tableService.context = this;
    this.keyService.watchContext.next({ context: this, service: this._hotkeysService });
  }

  ngOnInit() {
    this.listMaster['permission'] = this.storage.getRoutePermission(this.router.url);
    this.listMaster['status'] = [{ key: '0', value: 'In Active' }, { key: '1', value: 'Active' }];
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

    this.paymentTerm.getListPaymentTerm(params).subscribe(res => {
      try {
        this.list.items = res.data.rows;
        this.tableService.matchPagingOption(res.data);
        this.refresh();
      } catch (e) {
        console.log(e);
      }
    });
  }
  deletePayment(id) {
    const modalRef = this.modalService.open(ConfirmModalContent);
    modalRef.result.then(result => {
      if (result) {
        this.paymentTerm.deletePayment(id).subscribe(res => {
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
  createPaymentTerm() {
    this.router.navigate(['/admin-panel/payment-term/create']);
  }
  editPayment(id) {
    this.router.navigate(['/admin-panel/payment-term/edit', id]);
  }
  // convertStatus(id) {
  //   const stt = this.listMaster['status'].find(item => item.key === id);
  //   return stt.value;
  // }

    selectTable() {
        this.selectedIndex = 0;
        if (this.table.element.nativeElement.querySelector('td a')) {
            this.table.element.nativeElement.querySelector('td a').focus();
        }
    }
}
