import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { routerTransition } from '../../../router.animations';
import { TableService } from '../../../services/index';
import { ConfirmModalContent } from '../../../shared/modals/confirm.modal';
import { PayTermKeyService } from './keys.control';
import { PaymentTermService } from './payterm.service';

@Component({
  selector: 'app-payterm',
  providers: [PaymentTermService, PayTermKeyService],
  templateUrl: 'payterm.component.html',
  animations: [routerTransition()]
})

export class PaymentTermComponent implements OnInit {
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
    private paymentTerm: PaymentTermService,
    public keyService: PayTermKeyService,
    private modalService: NgbModal,
    private toastr: ToastrService) {
    this.searchForm = fb.group({
      'cd': [null],
      'des': [null]
    });

    // Assign get list function name, override variable here
    this.tableService.getListFnName = 'getList';
    this.tableService.context = this;
    this.keyService.watchContext.next(this);
  }

  ngOnInit() {
    this.listMaster['status'] = [{ key: 'IA', value: 'In Active' }, { key: 'AT', value: 'Active' }];
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

    this.paymentTerm.getListPaymentTerm(params).subscribe(res => {
      try {
        this.list.items = res.data.rows;
        this.tableService.matchPagingOption(res.data);
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
  convertStatus(id) {
    const stt = this.listMaster['status'].find(item => item.key === id);
    return stt.value;
  }

}
