import { Component, EventEmitter, Input, OnInit, Output, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FinancialService } from '../../financial.service';
import { TableService } from './../../../../services/table.service';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../../environments/environment';
import { ConfirmModalContent } from '../../../../shared/modals/confirm.modal';
import { MailModalComponent } from '../modals/mail.modal';

@Component({
    selector: 'app-invoice-info-tab',
    templateUrl: './information-tab.component.html',
    styleUrls: ['./invoice-tab.component.scss'],
    providers: [FinancialService]
})
export class InvoiceInformationTabComponent implements OnInit {

    /**
     * letiable Declaration
     */

    public _invoiceId;
    @Input() set invoiceId(id) {
        if (id) {
            this._invoiceId = id;
        }
    }
    data = {};

    public messageConfig = {
        1: 'Are you sure that you want to reopen the current invoice?',
        2: 'Are you sure that you want to submit the invoice to approver?',
        7: 'Are you sure that you want to cancel current invoice?',
        4: 'Are you sure that you want to approve the current invoice?',
        3: 'Are you sure that you want to reject the current invoice?',
    };

    public invoice_info: any = {};

    public detail: any = {
        'contact_user': {},
        'billing': {},
        'shipping_address': {},
        'items': [],
    };


    constructor(
        public toastr: ToastrService,
        public fb: FormBuilder,
        private vRef: ViewContainerRef,
        private router: Router,
        private http: HttpClient,
        private modalService: NgbModal,
        private financialService: FinancialService,
        public tableService: TableService) {
    }

    ngOnInit() {
        this.getList();
        this.invoice_info['taxs'] = [];
    }

    /**
     * Internal Function
     */
    printPDF(id, inv_num) {
        const path = 'ar-invoice/print-pdf/';
        const url = `${environment.api_url}${path}${id}`;
        const headers: HttpHeaders = new HttpHeaders();
        // Check if Pdf exist
        this.http.get(url, {
            headers,
            responseType: 'blob',
        }).subscribe(res => {
            const newWindow = window.open(`assets/pdfjs/web/viewer.html?openFile=false&encrypt=true&fileName=${inv_num}.pdf&file=${btoa(url)}`, '_blank');
            newWindow.document.title = inv_num;
            newWindow.focus();
        });
    }

    sendMail(id) {
        const modalRef = this.modalService.open(MailModalComponent, { size: 'lg', windowClass: 'modal-md' });
        modalRef.result.then(res => {
        }, dismiss => { });
        modalRef.componentInstance.invoiceId = id;
    }

    getList() {
        this.financialService.getDetailInvoice(this._invoiceId).subscribe(res => {
            try {
                this.detail = res.data;
                this.detail.contact_user = res.data.contact_user || [];
                this.detail.shipping_address = res.data.shipping_address || [];
                this.detail.billing = res.data.billing_address || [];
            } catch (e) {
                console.log(e);
            }
        });
    }

    groupTax(items) {
        this.invoice_info['taxs'] = [];
        this.invoice_info['total_tax'] = 0;
        const taxs = items.map(item => item.tax_percent || 0);
        const unique = taxs.filter((i, index) => taxs.indexOf(i) === index);
        unique.forEach((tax, index) => {
            let taxAmount = 0;
            items.filter(item => item.tax_percent === tax).map(i => {
                taxAmount += (+i.tax_percent * +i.qty_inv * ((+i.price || 0) * (100 - (+i.discount_percent || 0)) / 100) / 100);
            });
            this.invoice_info['total_tax'] = this.invoice_info['total_tax'] + +taxAmount.toFixed(2);
            this.invoice_info['taxs'].push({
                value: tax, amount: taxAmount.toFixed(2)
            });
        });
    }



    updateStatus(id, status) {
        const params = { status };
        this.financialService.updateInvoiceStatus(id, params).subscribe(res => {
            try {
                this.toastr.success(res.message);
                this.getList();
            } catch (e) {
                console.log(e);
            }
        });
    }

    confirmModal(id, status) {
        const modalRef = this.modalService.open(ConfirmModalContent, { size: 'lg', windowClass: 'modal-md' });
        modalRef.result.then(res => {
            if (res) {
                this.updateStatus(id, status);
            }
        }, dismiss => { });
        modalRef.componentInstance.message = this.messageConfig[status];
        modalRef.componentInstance.yesButtonText = 'Yes';
        modalRef.componentInstance.noButtonText = 'No';
    }

}
