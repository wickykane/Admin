import { Component, EventEmitter, Input, OnInit, Output, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FinancialService } from '../../financial.service';
import { TableService } from './../../../../services/table.service';

import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ConfirmModalContent } from '../../../../shared/modals/confirm.modal';

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
    public totalQTY;
    public totalInvoiceQTY;
    data = {};

    public messageConfig = {
        'SM': 'Are you sure that you want to Submit this quotation to approver?',
        'CC': 'Are you sure that you want to cancel this quotation?',
        'CLONE': 'Are you sure that you want to copy this quote?',
        'AM': 'Are you sure that you want to approve this quotation?',
        'RM': 'Are you sure that you want to reject this quotation?',
        'SC': 'Are you sure that you want to convert this quotation to SO?',
    };
    public _orderId;
    public _orderDetail;
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

    getList() {
        this.financialService.getDetailInvoice(this._invoiceId).subscribe(res => {
            try {
                this.detail = res.data;
                this.detail.contact_user = res.data.contact_user || [];
                this.detail.shipping_address = res.data.shipping_address || [];
                this.detail.billing = res.data.billing_address || [];
                this.updateTotal();
                this.getEarlyPaymentValue();
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
                taxAmount += (+i.tax_percent * +i.qty * (+i.price || 0) / 100);
            });
            this.invoice_info['total_tax'] = this.invoice_info['total_tax'] + taxAmount.toFixed(2);
            this.invoice_info['taxs'].push({
                value: tax, amount: taxAmount.toFixed(2)
            });
        });
    }

    getEarlyPaymentValue() {
        const issue_dt = this.detail['inv_dt'];
        const payment_term_id = this.detail['payment_term_id'];
        const total_due = this.invoice_info['total'];
        if (issue_dt && payment_term_id && total_due) {
            this.financialService.getEarlyPaymentValue(issue_dt, payment_term_id, total_due).subscribe(res => {
                if (res.data) {
                    this.data['is_fixed_early'] = res.data.is_fixed;
                    this.invoice_info.incentive_percent = res.data.percent;
                    this.invoice_info.incentive = res.data.value;
                    this.invoice_info.expires_dt = res.data.expires_dt;
                    this.invoice_info.grand_total = this.invoice_info.total - this.invoice_info.incentive;
                }
            });
        }
    }

    updateTotal() {
        this.invoice_info.total = 0;
        this.invoice_info.sub_total = 0;
        this.groupTax(this.detail.inv_detail);

        this.detail.inv_detail.forEach(item => {
            const amount = (+item.qty_inv * (+item.price || 0)) * (100 - (+item.discount_percent || 0)) / 100;
            this.invoice_info.sub_total += amount;
        });
        this.invoice_info.total = +this.invoice_info['total_tax'] + +this.invoice_info.sub_total;
        if (this.invoice_info.incentive_percent) {
            this.invoice_info.incentive = +this.invoice_info.incentive_percent * +this.invoice_info.total / 100;
        }
        this.invoice_info.grand_total = +this.invoice_info.total - +this.invoice_info.incentive;
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
                if (status === 'CLONE') {
                    this.cloneQuote(id);
                    return;
                }
                this.updateStatus(id, status);
            }
        }, dismiss => { });
        modalRef.componentInstance.message = this.messageConfig[status];
        modalRef.componentInstance.yesButtonText = 'Yes';
        modalRef.componentInstance.noButtonText = 'No';
    }

    cloneQuote(id) {
        this.router.navigate(['/order-management/sale-quotation/create'], { queryParams: { is_copy: 1, quote_id: id } });
    }


}
