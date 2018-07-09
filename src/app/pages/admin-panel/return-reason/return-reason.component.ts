import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { routerTransition } from '../../../router.animations';
import { TableService } from '../../../services/index';
import { ReturnReasonKeyService } from './keys.control';
import { ReturnReasonService } from './return-reason.service';

@Component({
  selector: 'app-return-reason',
  providers: [ReturnReasonService, ReturnReasonKeyService],
  templateUrl: 'return-reason.component.html',
  animations: [routerTransition()]
})

export class ReturnReasonComponent implements OnInit {
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
    private returnReasonService: ReturnReasonService,
    public keyService: ReturnReasonKeyService,
    private modalService: NgbModal,
    private toastr: ToastrService) {
    this.searchForm = fb.group({
      'cd': [null],
      'des': [null]
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

    this.returnReasonService.getListReturnReason(params).subscribe(res => {
      try {
        this.list.items = res.data.rows;
        this.tableService.matchPagingOption(res.data);
      } catch (e) {
        console.log(e);
      }
    });
  }
  deleteReason(id) {
    this.returnReasonService.deleteReturnReason(id).subscribe(res => {
      try {
        this.toastr.success(res.data.message);
        this.getList();
      } catch (e) {
        console.log(e);
      }
    });
  }
  createReturnReason() {
    this.router.navigate(['/admin-panel/return-reason/create']);
  }
  editReturnReason(id) {
    this.router.navigate(['/admin-panel/return-reason/edit', id]);
  }

}
