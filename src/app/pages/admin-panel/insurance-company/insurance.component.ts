import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { routerTransition } from '../../../router.animations';
import { TableService } from '../../../services/index';
import { ConfirmModalContent } from '../../../shared/modals/confirm.modal';
import { InsuranceService } from './insurance.service';
import { InsuranceBranchModalComponent } from './modal/branch.modal';
import { InsuranceModalComponent } from './modal/insurance.modal';

import { InsuranceKeyService } from './keys.control';

@Component({
  selector: 'app-insurance',
  providers: [InsuranceService, InsuranceKeyService],
  templateUrl: 'insurance.component.html',
  animations: [routerTransition()]
})

export class InsuranceComponent implements OnInit {
  /**
   *  Variable
   */
  public searchForm: FormGroup;
  public listMaster = {};
  public selectedIndex = 0;
  public list = {
    items: []
  };

  public data = {};
  constructor(
    private fb: FormBuilder,
    public tableService: TableService,
    private activeRouter: ActivatedRoute,
    private router: Router,
    private insuranceService: InsuranceService,
    private modalService: NgbModal,
    private toastr: ToastrService,
    public keyService: InsuranceKeyService, ) {
    this.searchForm = fb.group({
      'code': [null],
      'name': [null],
      'swift': [null],
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
   * Table Event
   */

  selectData(index) {
    console.log(index);
  }

  /**
   * Internal Function
   */

  getList() {
    const params = { ...this.tableService.getParams(), ...this.searchForm.value };
    Object.keys(params).forEach((key) => (params[key] === null || params[key] === '') && delete params[key]);

    this.insuranceService.getListInsurance(params).subscribe(res => {
      try {
        this.list.items = res.data.rows;
        this.tableService.matchPagingOption(res.data);
      } catch (e) {
        console.log(e);
      }
    });
  }

  createInsurance(params) {
    this.insuranceService.createInsurance(params).subscribe(res => {
      try {
        this.toastr.success(res.data.message);
        this.getList();
      } catch (e) {
        console.log(e);
      }
    });
  }

  updateInsurance(params) {
    this.insuranceService.updateInsurance(params).subscribe(res => {
      try {
        this.toastr.success(res.data.message);
        this.getList();
      } catch (e) {
        console.log(e);
      }
    });
  }

  deleteInsurance(id) {
    const modalRef = this.modalService.open(ConfirmModalContent);
    modalRef.result.then(result => {
      if (result) {
        this.insuranceService.deleteInsurance(id).subscribe(res => {
          try {
            this.toastr.success(res.data.message);
            this.getList();
          } catch (e) {
            console.log(e);
          }
        });
      }
    });
  }

  // Modal
  editInsurance(flag?) {
    const modalRef = this.modalService.open(InsuranceModalComponent, { windowClass: 'md-modal' });
    modalRef.componentInstance.modalTitle = (flag) ? 'EDIT BANK' : 'CREATE NEW BANK';
    modalRef.componentInstance.isEdit = flag;
    modalRef.componentInstance.item = flag || {};
    modalRef.result.then(data => {
      const params = { data };
      if (!flag) {
        this.createInsurance(params);
      } else {
        this.updateInsurance(params);
      }
    },
      dismiss => { });
  }

  addBranch(item) {
    const modalRef = this.modalService.open(InsuranceBranchModalComponent, { windowClass: 'md-modal' });
    modalRef.componentInstance.modalTitle = 'CREATE NEW BRANCH';
    modalRef.componentInstance.insuranceData = item || {};
    modalRef.result.then(data => {
      this.createBranch(item.id, data);
    },
      dismiss => { });
  }

  createBranch(insuranceId, params) {
    this.insuranceService.createBranch(insuranceId, params).subscribe(res => {
      try {
        this.toastr.success(res.data.message);
      } catch (e) {
        console.log(e);
      }
    });
  }
}
