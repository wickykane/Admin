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
import { FinancialService } from '../../financial.service';
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
        submited_full_fill: 'This Receipt Voucher is missing some mandatory fields, please fulfill them before submitting.',
        submited_is_amount_remain: 'There is overpayment in this receipt voucher. Are you sure that you want to submit it? ',
        submited_zero_amount_remain: 'Are you sure that you want to submit this receipt voucher?',
        approved_is_amount_remain: 'There is overpayment in this receipt voucher. After approval, the system will create automatically the credit memo for the overpayment. Do you want to proceed? ',
        approved_zero_amount_remain: 'Are you sure that you want to Approve this receipt voucher? ',
        mix_multi_receipt: 'Some documents have been paid by customer, current applied amount in this receipt voucher will be converted to Credit Memo for overpayment. Do you want to proceed?',
        reject: 'Are you sure that you want to reject this receipt voucher?',
        cancel: 'Are you sure that you want to cancel this receipt voucher?'
    };
    public selected_message = '';

    public detail: any = {
        'items': [],
    };
    public is_fullfill = true;

    public key_required = {
        company_id: null,
        payment_date: null,
        warehouse_id: null,
        electronic: null,
        payment_method_id: null,
        gl_account: null,
        approver_id: null,
        price_received: null
    };
    public isInstallQuickbook = false;

    constructor(
        public toastr: ToastrService,
        public fb: FormBuilder,
        private vRef: ViewContainerRef,
        private router: Router,
        private http: HttpClient,
        private modalService: NgbModal,
        private receiptVoucherService: ReceiptVoucherService,
        private financialService: FinancialService,
        public tableService: TableService) {
    }

    ngOnInit() {
        this.getQuickbookSettings();
        this.getDetailVoucher();
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

    getDetailVoucher() {
        this.receiptVoucherService.getDetailReceiptVoucher(this._receiptId).subscribe(res => {
            try {
                this.detail = res.data;
                this.key_required =  {
                    company_id: res.data.company_id,
                    payment_date: res.data.payment_date,
                    warehouse_id: res.data.warehouse_id,
                    electronic: res.data.electronic,
                    payment_method_id: res.data.payment_method_id,
                    gl_account: res.data.gl_account,
                    approver_id: res.data.approver_id,
                    price_received: res.data.price_received
                };
                console.log(this.key_required);
                this.checkFieldRequired(this.key_required);
            } catch (e) {
                console.log(e);
            }
        });
    }

    getQuickbookSettings() {
        this.financialService.getSettingInfoQuickbook().subscribe(
            res => {
                this.isInstallQuickbook = res.data.state === 'authorized' ? true : false;
            }, err => {}
        );
    }
    checkFieldRequired(params) {
        console.log(params);
        Object.keys(params).forEach((key) => {
            if (params[key] === null || params[key] === '') {
                return this.is_fullfill = false;
            }
        });
        console.log(this.is_fullfill);
    }

    updateStatus(id, status) {
        const params = { voucher_id: id, status };
        this.receiptVoucherService.updateReceiptVoucherStatus(params).subscribe(res => {
            try {
                this.toastr.success(res.message);
                if (status === 3 && this.isInstallQuickbook) {
                    this.financialService.syncReceiptVoucherToQuickbook(id).subscribe(
                        _res => {
                            try {
                                const result = JSON.parse(_res['_body']);
                                this.toastr.success(`Receipt Voucher ${result.data[0].entity.DocNumber} has been sync to Quickbooks successfully.`);
                            } catch (err) {}
                        },
                        err => {
                            this.toastr.error(`Cannot sync Receipt Voucher to Quickbooks.`);
                        }
                    );
                }
                this.getDetailVoucher();
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

        switch (status) {
            case 2:
                if (!this.is_fullfill) {
                    this.selected_message = this.messageConfig.submited_full_fill;
                }
                if (this.is_fullfill && Number(this.detail.price_remaining) === 0) {
                    this.selected_message = this.messageConfig.submited_zero_amount_remain;
                }
                if (this.is_fullfill && Number(this.detail.price_remaining) > 0) {
                    this.selected_message = this.messageConfig.submited_is_amount_remain;
                }
                break;
            case 3:
                if (Number(this.detail.price_remaining) === 0) {
                    this.selected_message = this.messageConfig.approved_zero_amount_remain;
                }
                if (Number(this.detail.price_remaining) > 0) {
                    this.selected_message = this.messageConfig.approved_is_amount_remain;
                }
                break;
            case 4:
                this.selected_message = this.messageConfig.reject;
                break;
            case 6:
                this.selected_message = this.messageConfig.cancel;
                break;
        }
        modalRef.componentInstance.message = this.selected_message;
        modalRef.componentInstance.yesButtonText = 'Yes';
        modalRef.componentInstance.noButtonText = 'No';
    }

}
