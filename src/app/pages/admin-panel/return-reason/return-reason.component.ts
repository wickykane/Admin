import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HotkeysService } from 'angular2-hotkeys';
import { ToastrService } from 'ngx-toastr';
import { routerTransition } from '../../../router.animations';
import { TableService } from '../../../services/index';
import { ConfirmModalContent } from '../../../shared/modals/confirm.modal';
import { ReturnReasonKeyService } from './keys.control';
import { ReturnReasonService } from './return-reason.service';

import { StorageService } from '../../../services/storage.service';
import { cdArrowTable } from '../../../shared';
@Component({
  selector: 'app-return-reason',
  providers: [ReturnReasonService, ReturnReasonKeyService],
  templateUrl: 'return-reason.component.html',
  styleUrls: ['./reason.component.scss'],
  animations: [routerTransition()],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ReturnReasonComponent implements OnInit {
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
    private returnReasonService: ReturnReasonService,
    private _hotkeysService: HotkeysService,
    public keyService: ReturnReasonKeyService,
    private modalService: NgbModal,
    private storage: StorageService,
    private toastr: ToastrService) {
    this.searchForm = fb.group({
      'cd': [null],
      'des': [null],
      'exclude_rr_calc': [null]
    });

    // Assign get list function name, override variable here
    this.tableService.getListFnName = 'getList';
    this.tableService.context = this;
    //  Init Key
    this.keyService.watchContext.next({ context: this, service: this._hotkeysService });
  }


  ngOnInit() {
    this.listMaster['permission'] = this.storage.getRoutePermission(this.router.url);
    this.listMaster['status'] = [{ key: 'IA', value: 'In Active' }, { key: 'AT', value: 'Active' }];
    this.listMaster['Reason'] = [{ key: '0', value: 'No' }, { key: '1', value: 'Yes' }];
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

    this.returnReasonService.getListReturnReason(params).subscribe(res => {
      try {
        this.list.items = res.data.rows;
        this.tableService.matchPagingOption(res.data);
        this.refresh();
      } catch (e) {
        console.log(e);
      }
    });
  }
  deleteReason(id) {
    const modalRef = this.modalService.open(ConfirmModalContent);
    modalRef.result.then(result => {
      if (result) {
        this.returnReasonService.deleteReturnReason(id).subscribe(res => {
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
  createReturnReason() {
    this.router.navigate(['/admin-panel/return-reason/create']);
  }
  editReturnReason(id) {
    this.router.navigate(['/admin-panel/return-reason/edit', id]);
  }
  convertStatus(id) {
    const stt = this.listMaster['status'].find(item => item.key === id);
    return stt.value;
  }

    selectTable() {
        this.selectedIndex = 0;
        if (this.table.element.nativeElement.querySelector('td a')) {
            this.table.element.nativeElement.querySelector('td a').focus();
        }
    }
}
