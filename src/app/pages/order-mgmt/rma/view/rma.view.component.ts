import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ToastrService } from 'ngx-toastr';
import { routerTransition } from '../../../../router.animations';
import { RMAService } from '../rma.service';

@Component({
  selector: 'app-rma.view',
  templateUrl: './rma.view.component.html',
  styleUrls: ['../rma.component.scss']
})
export class RmaDetailComponent implements OnInit {
  /**
   * Variable Declaration
   */

  data = {};
  public orderId;
  public orderDetail = {
    order_sts_short_name: ''
  };


  /**
   * Init Data
   */
  constructor(
    private vRef: ViewContainerRef,
    private cd: ChangeDetectorRef,
    private fb: FormBuilder,
    public toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private service: RMAService) {
    //  Init Key


  }

  ngOnInit() {
    this.data['id'] = this.route.snapshot.paramMap.get('id');
    this.orderId = this.data['id'];
  }
  /**
   * Mater Data
   */

  checkRender(detail) {
    this.orderDetail = detail;
  }
  cancel() {
    this.router.navigate(['/order-management/return-order']);
  }

  putApproveOrder(order_id) {

  }

  updateStatusOrder(order_id, status) {

  }


  /**
   * Internal Function
   */

}
