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
    public invoiceId;
    public detail = {
        'billing_address': {},
        'shipping_address': {},
        'items': [],
        'buyer_info': {},
        'sales_order': {}
    };

    /**
     * Init Data
     */

    constructor(public sanitizer: DomSanitizer,
        private modalService: NgbModal,
        public toastr: ToastrService,
        private router: Router,
        private financialService: FinancialService,
        public keyService: InvoiceDetailKeyService,
        private route: ActivatedRoute) {

    }

    ngOnInit() {
        this.data['id'] = this.route.snapshot.paramMap.get('id');
        this.invoiceId = this.data['id'];
        this.getDetailInvoice();
    }
    /**
     * Mater Data
     */

    getDetailInvoice() {
        this.financialService.getDetailInvoice(this.invoiceId).subscribe(res => {
            try {
                this.detail = res.data;
                this.detail['billing_address'] = res.data.address.billing[0];
                this.detail['shipping_address'] = res.data.address.shipping[0];
                this.detail['sales_order'] = res.data.orders[0];
                this.detail['items'] = res.data.items;
                this.detail['buyer_info'] = res.data.address.list[0];
            } catch (e) {
                console.log(e);
            }
        });
    }

    updateInvoiceStatus(statusCode) {
        const params = {
            status_code: statusCode
        };
        this.financialService.updateInvoiceStatus(this.invoiceId, params).subscribe(res => {
            try {
                if (res.status) {
                    this.toastr.success(res.message);
                    this.getDetailInvoice();
                } else {
                    this.toastr.error(res.message, null, { enableHtml: true });
                }
            } catch (e) {
                console.log(e);
            }
        }, err => {
            this.toastr.error(err.message);
        });
    }

    editInvoice(id?) {
        if (id) {
            this.router.navigate(['/financial/invoice/edit', id]);
        }
    }

    back() {
        this.router.navigate(['/financial/invoice/']);
    }

}
