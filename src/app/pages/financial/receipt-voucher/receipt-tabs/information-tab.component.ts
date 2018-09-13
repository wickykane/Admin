import { Component, EventEmitter, Input, OnInit, Output, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReceiptVoucherService } from '../receipt-voucher.service';
import { TableService } from './../../../../services/table.service';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../../environments/environment';
import { ConfirmModalContent } from '../../../../shared/modals/confirm.modal';
import { ReceiptMailModalComponent } from '../modals/mail.modal';

@Component({
    selector: 'app-receipt-info-tab',
    templateUrl: './information-tab.component.html',
    styleUrls: ['./receipt-tab.component.scss'],
    providers: [ReceiptVoucherService]
})
export class ReceiptInformationTabComponent implements OnInit {

    /**
     * letiable Declaration
     */

    public _receiptId;
    @Input() set receiptId(id) {
        if (id) {
            this._receiptId = id;
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
        private receiptVoucherService: ReceiptVoucherService,
        public tableService: TableService) {
    }

    ngOnInit() {
        this.getList();
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
        const modalRef = this.modalService.open(ReceiptMailModalComponent, { size: 'lg', windowClass: 'modal-md' });
        modalRef.result.then(res => {
        }, dismiss => { });
        modalRef.componentInstance.invoiceId = id;
    }

    getList() {
        this.receiptVoucherService.getDetailReceiptVoucher(this._receiptId).subscribe(res => {
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

    updateStatus(id, status) {
        const params = { status };
        this.receiptVoucherService.updateReceiptVoucherStatus(id, params).subscribe(res => {
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
