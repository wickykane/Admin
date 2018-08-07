import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { routerTransition } from '../../../router.animations';
import { TableService } from '../../../services/index';
import { ConfirmModalContent } from '../../../shared/modals/confirm.modal';
import { TaxTypesModalComponent } from './modal/tax-types.modal';
import { TaxTypesService } from './tax-types.service';

@Component({
  selector: 'app-tax-types',
  providers: [TaxTypesService],
  templateUrl: 'tax-types.component.html',
  animations: [routerTransition()]
})

export class TaxTypesComponent implements OnInit {
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
    public toastr: ToastrService,
    public modalService: NgbModal,
    private taxTypesService: TaxTypesService) {
    this.searchForm = fb.group({
      'ac': [null],
      'description': [null]
    });

    // Assign get list function name, override variable here
    this.tableService.getListFnName = 'getList';
    this.tableService.context = this;
  }

  ngOnInit() {
    this.listMaster['status'] = [{ key: '0', value: 'In Active' }, { key: '1', value: 'Active' }];
    // Init Fn
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

    this.taxTypesService.getListTaxTypes(params).subscribe(res => {
      try {
        this.list.items = res.data.rows;
        this.tableService.matchPagingOption(res.data);
      } catch (e) {
        console.log(e);
      }
    });
  }
  deleteTaxTypes(id) {
    const modalRef = this.modalService.open(ConfirmModalContent);
    modalRef.result.then(result => {
      if (result) {
        this.taxTypesService.deleteTaxTypesById(id).subscribe(res => {
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
  createTaxType(params) {
    this.taxTypesService.postTaxTypes(params).subscribe(res => {
      try {
        this.toastr.success(res.message);
        this.getList();
      } catch (e) {
        console.log(e);
      }
    });
  }

  updateTaxType(id, params) {
    this.taxTypesService.updateTaxTypesByID(id, params).subscribe(res => {
      try {
        this.toastr.success(res.message);
        this.getList();
      } catch (e) {
        console.log(e);
      }
    });
  }
  editTaxTypes(flag?) {
    const modalRef = this.modalService.open(TaxTypesModalComponent, { windowClass: 'md-modal' });
    modalRef.componentInstance.modalTitle = (flag) ? 'EDIT TAX TYPE' : 'CREATE NEW TAX TYPE';
    modalRef.componentInstance.isEdit = flag;
    modalRef.componentInstance.item = flag || {};
    modalRef.result.then(data => {
      const params = { ...data };
      if (!flag) {
        this.createTaxType(params);
      } else {
        this.updateTaxType(flag.id, params);
      }
    },
      dismiss => { });
  }
}
