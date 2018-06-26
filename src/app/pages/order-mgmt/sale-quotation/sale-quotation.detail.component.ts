import { PrintHtmlService } from './../../../services/print.service';
import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, Input } from '@angular/core';
import { Form, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { OrderService } from '../order-mgmt.service';
import { routerTransition } from '../../../router.animations';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-detail-quotation',
    templateUrl: './sale-quotation.detail.component.html',
    styleUrls: ['./sale-quotation.component.scss'],
    animations: [routerTransition()],
    providers: [PrintHtmlService]
})

export class SaleQuotationDetailComponent implements OnInit {
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
    constructor(public sanitizer: DomSanitizer,
        private modalService: NgbModal,
        private printService: PrintHtmlService,
        public toastr: ToastrService,
        private router: Router,
        private orderService: OrderService,
        private route: ActivatedRoute) {

    }

    ngOnInit() {
        this.data['id'] = this.route.snapshot.paramMap.get('id');
        this.orderId = this.data['id'];
    }
    /**
     * Mater Data
     */

    checkRender(detail) {
        this.data['sale_quote_id'] = detail['sale_quote_id'];
        this.orderDetail = detail;
    }

    back() {
        this.router.navigate(['/order-management/sale-quotation']);
    }

    sentMailToBuyer(id) {
        this.orderService.sentMailToBuyer(id).subscribe(res => {
            try {
                this.toastr.success(res.message);
                this.router.navigate(['/order-management/sale-quotation/detail/', {id: this.orderId}]);
            } catch (e) {
                console.log(e);
            }
        });
    }

    approveByManager(id) {
        const params = { status: 'AM' };
        this.orderService.updateSaleQuoteStatus(id, params).subscribe(res => {
            try {
                this.toastr.success(res.message);
                this.router.navigate(['/order-management/sale-quotation/detail/', {id: this.orderId}]);

            } catch (e) {
                console.log(e);
            }
        });

    }

    rejectByManager(id) {
        const params = { status: 'RM' };
        this.orderService.updateSaleQuoteStatus(id, params).subscribe(res => {
            try {
                this.toastr.success(res.message);
                this.router.navigate(['/order-management/sale-quotation/detail/', {id: this.orderId}]);

            } catch (e) {
                console.log(e);
            }
        });

    }


    /**
     * Internal Function
     */
    //  showDetail(objInv) {
    //    const modalRef = this.modalService.open(InvoiceModalContent, { size: 'lg' });
    //    modalRef.result.then(
    //      res => {
    //        if (res) {
    //          this.printInvoice();
    //        }
    //      },
    //      reason => { }
    //    );
    //    modalRef.componentInstance.detail = objInv;
    //    modalRef.componentInstance.name = 'INVOICE NO :' + objInv.general.invoice_num;
    //  }

    //  getInvoice(order_id) {
    //    this.orderService.getInvoice(order_id).subscribe((res) => {
    //      this.data['invList'] = res.results.rows;
    //    });
    //  }

    //  getSrcIframe(order_num) {
    //    const url = 'http:// wms360.nabp-demo.seldatdirect.com/fe-upload/?transaction=' + order_num;
    //    return url;
    //  }


}
