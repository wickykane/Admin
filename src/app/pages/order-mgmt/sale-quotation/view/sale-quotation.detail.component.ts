import { Component, ElementRef, EventEmitter, OnInit, Output, Renderer, ViewChild, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PrintHtmlService } from '../../../../services/print.service';

import { ToastrService } from 'ngx-toastr';
import { routerTransition } from '../../../../router.animations';
import { OrderService } from '../../order-mgmt.service';
import { SaleQuoteDetailKeyService } from './keys.detail.control';

@Component({
    selector: 'app-detail-quotation',
    templateUrl: './sale-quotation.detail.component.html',
    styleUrls: ['../sale-quotation.component.scss'],
    animations: [routerTransition()],
    providers: [PrintHtmlService, SaleQuoteDetailKeyService]
})


export class SaleQuotationDetailComponent implements OnInit {

    data = {};
    public orderId;
    public orderDetail = {
        order_sts_short_name: ''
    };


    /**
     * Init Data
     */
    constructor(public sanitizer: DomSanitizer,
        private modalService: NgbModal,
        private printService: PrintHtmlService,
        public toastr: ToastrService,
        private router: Router,
        private orderService: OrderService,
        public keyService: SaleQuoteDetailKeyService,
        private route: ActivatedRoute) {
        //  Init Key
        this.keyService.watchContext.next(this);

    }

    ngOnInit() {
        this.data['id'] = this.route.snapshot.paramMap.get('id');
        this.orderId = this.data['id'];
    }
    /**
     * Mater Data
     */

    checkRender(detail) {
        console.log(detail);
        this.orderDetail = detail;
    }
    cancel() {
        console.log('ab');
        this.router.navigate(['/order-management/sale-order']);
    }

    putApproveOrder(order_id) {
        // const params = {'status_code': 'AP'};
        this.orderService.approveOrd(order_id).subscribe(res => {
            if (res.status) {
                this.toastr.success(res.message);
                setTimeout(() => {
                    this.router.navigate(['/order-management/sale-order']);
                }, 500);
            } else {
                this.toastr.error(res.message);
            }
        },
            err => {
                this.toastr.error(err.message);
            }
        );
    }

}
