import { Component, ElementRef, EventEmitter, OnInit, Output, Renderer, ViewChild, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PrintHtmlService } from '../../../../services/print.service';

import { ToastrService } from 'ngx-toastr';
import { routerTransition } from '../../../../router.animations';
import { OrderService } from '../../order-mgmt.service';
import {SaleQuoteDetailKeyService} from './keys.detail.control';

@Component({
    selector: 'app-detail-quotation',
    templateUrl: './sale-quotation.detail.component.html',
    styleUrls: ['../sale-quotation.component.scss'],
    animations: [routerTransition()],
    providers: [PrintHtmlService, SaleQuoteDetailKeyService]
})


export class SaleQuotationDetailComponent implements OnInit {
    /**
     * Variable Declaration
     */

    public orderId;
    public orderDetail = {};
    @Output() stockValueChange = new EventEmitter();


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
        this.keyService.watchContext.next(this);

    }

    ngOnInit() {
        this.orderId =  this.route.snapshot.paramMap.get('id');
        console.log(this.orderId);
        this. getList();
    }
    /**
     * Mater Data
     */

    checkRender(detail) {
        this.orderDetail = detail;
    }

    back() {
        this.router.navigate(['/order-management/sale-quotation']);
    }

    approveByManager(id) {
        const params = { status: 'AM' };
        this.orderService.updateSaleQuoteStatus(id, params).subscribe(res => {
            try {
                this.toastr.success(res.message);
                this.getList();
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
                this.getList();
            } catch (e) {
                console.log(e);
            }
        });

    }
    convertOrderToSO(id) {
        const params = {};
        this.orderService.convertOrderToSO(id, params).subscribe(res => {
            try {
                this.toastr.success(res.message);
                this.getList();

            } catch (e) {
                console.log(e);
            }
        });
    }
    getList() {

        this.orderService.getSaleQuoteDetail(this.orderId).subscribe(res => {
            try {
                this.orderDetail = res.data;
                this.stockValueChange.emit(res.data) ;

            } catch (e) {
                console.log(e);
            }
        });
    }


    /**
     * Internal Function
     */

}
