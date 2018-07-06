import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { routerTransition } from '../../../../router.animations';
import { TableService } from '../../../../services/index';
import { ConfirmModalContent } from '../../../../shared/modals/confirm.modal';
import { InsuranceService } from '../insurance.service';
import { InsuranceBranchModalComponent } from '../modal/branch.modal';

@Component({
  selector: 'app-insurance-branch',
  providers: [InsuranceService],
  templateUrl: 'branch.component.html',
  animations: [routerTransition()]
})

export class InsuranceBranchComponent implements OnInit {
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
    private toastr: ToastrService) {
    this.searchForm = fb.group({
      'branch_name': [null],
    });

    // Assign get list function name, override variable here
    this.tableService.getListFnName = 'getList';
    this.tableService.context = this;
  }

  ngOnInit() {
    this.data['insurance_id'] = this.activeRouter.snapshot.params['id'];
    this.getInsuranceDetail(this.data['insurance_id']);
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

  getInsuranceDetail(id) {
    this.insuranceService.getDetailInsurance(id).subscribe(res => {
      this.data['insuranceData'] = res.data;
    });
  }

  getList() {
    const params = { ...this.tableService.getParams(), ...this.searchForm.value };
    Object.keys(params).forEach((key) => (params[key] === null || params[key] === '') && delete params[key]);

    this.insuranceService.getListBranch(this.data['insurance_id'], params).subscribe(res => {
      try {
        this.list.items = res.data.rows;
        this.tableService.matchPagingOption(res.data);
      } catch (e) {
        console.log(e);
      }
    });
  }

  createBranch(params) {
    this.insuranceService.createBranch(this.data['insurance_id'], params).subscribe(res => {
      try {
        this.toastr.success(res.data.message);
        this.getList();
      } catch (e) {
        console.log(e);
      }
    });
  }

  updateBranch(insuranceId, branchId, params) {
    this.insuranceService.updateBranch(insuranceId, branchId, params).subscribe(res => {
      try {
        this.toastr.success(res.data.message);
        this.getList();
      } catch (e) {
        console.log(e);
      }
    });
  }

  deleteBranch(insuranceId, branchId) {
    const modalRef = this.modalService.open(ConfirmModalContent);
    modalRef.result.then(result => {
      if (result) {
        this.insuranceService.deleteBranch(insuranceId, branchId).subscribe(res => {
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
  editBranch(branchId, flag?) {
    const modalRef = this.modalService.open(InsuranceBranchModalComponent, { windowClass: 'md-modal' });
    modalRef.componentInstance.modalTitle = (flag) ? 'EDIT BRANCH' : 'CREATE NEW BRANCH';
    modalRef.componentInstance.branchId = branchId;
    modalRef.componentInstance.insuranceId = this.data['insurance_id'];
    modalRef.componentInstance.insuranceData = this.data['insuranceData'] || {};

    modalRef.result.then(data => {
      const params = { data };
      if (!flag) {
        this.createBranch(params);
      } else {
        this.updateBranch(this.data['insurance_id'], branchId, params);
      }
    },
      dismiss => { });
  }
}
