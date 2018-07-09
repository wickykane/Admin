import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ToastrService } from 'ngx-toastr';
import { routerTransition } from '../../../router.animations';
import { InvoiceModalContent } from '../../../shared/modals/invoice.modal';
import { FinancialService } from '../financial.service';
import { InvoiceDetailKeyService } from './keys.view.control';

@Component({
    selector: 'app-invoice-detail',
    templateUrl: './invoice.view.component.html',
    styleUrls: ['./invoice.component.scss'],
    providers: [InvoiceDetailKeyService],
    animations: [routerTransition()]
})

export class InvoiceDetailComponent implements OnInit {
    /**
     * Variable Declaration
     */

    public data = {};
    public orderId;
    public orderDetail = {
        order_sts_short_name: ''
    };


    /**
     * Init Data
     */
    constructor(public sanitizer: DomSanitizer,
        private modalService: NgbModal,
        public toastr: ToastrService,
        private router: Router,
        private financialService: FinancialService,
        private keyService: InvoiceDetailKeyService,
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
        this.orderDetail = detail;
    }
    cancel() {
        console.log('ab');
        this.router.navigate(['/order-management/sale-order']);
    }



}
