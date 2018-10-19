import { Component, EventEmitter, Inject, Input, OnInit, Output, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FinancialService } from '../../financial.service';
import { TableService } from './../../../../services/table.service';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HotkeysService } from 'angular2-hotkeys';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../../environments/environment';
import { ConfirmModalContent } from '../../../../shared/modals/confirm.modal';
import { MailModalComponent } from '../modals/mail.modal';
import { PODModalComponent } from '../modals/POD/pod.modal';
import { InvoiceDetailComponent } from '../view/invoice.view.component';
import { InvoiceDetailKeyService } from '../view/keys.view.control';

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
    public isInstallQuickbook = false;

    public messageConfig = {
        1: 'Are you sure that you want to reopen the current invoice?',
        2: 'Are you sure that you want to submit the invoice to approver?',
        7: 'Are you sure that you want to cancel current invoice?',
        4: 'Are you sure that you want to approve the current invoice?',
        3: 'Are you sure that you want to reject the current invoice?',
        11: 'Are you sure that you want to revise the current invoice?',
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
        private _hotkeysService: HotkeysService,
        public keyService: InvoiceDetailKeyService,
        private financialService: FinancialService,
        @Inject(InvoiceDetailComponent) private parent: InvoiceDetailComponent,
        public tableService: TableService) {
            //  Init Key
        if (!this.parent.data['shortcut']) {
            this.keyService.watchContext.next({ context: this, service: this._hotkeysService });
        }
    }

    ngOnInit() {
        this.getQuickbookSettings();
        this.getList();
        this.data['tab'] = {
            active: 0,
        };
        this.changeShortcut();
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
                this.getEarlyPaymentValue();
            } catch (e) {
                console.log(e);
            }
        });
    }

    getQuickbookSettings() {
        this.financialService.getSettingInfoQuickbook().subscribe(
            res => {
                this.isInstallQuickbook = res.data.state === 'authorized' ? true : false;
            }, err => { }
        );
    }

    updateStatus(id, status) {
        const params = { status };
        this.financialService.updateInvoiceStatus(id, params).subscribe(res => {
            try {
                this.toastr.success(res.message);
                if (status === 4 && this.isInstallQuickbook) {
                    this.financialService.syncInvoiceToQuickbook(id).subscribe(
                        _res => {
                            try {
                                const result = JSON.parse(_res['_body']);
                                this.toastr.success(`Invoice ${result.data[0].entity.DocNumber} has been sync to Quickbooks successfully.`);
                            } catch (err) { }
                        },
                        err => {
                            this.toastr.error(`Cannot sync invoice to Quickbooks.`);
                        }
                    );
                }
                if (+id === 11) {
                    this.router.navigate(['/financial/invoice/edit/' + id]);
                    return;
                }
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

    getEarlyPaymentValue() {
        const issue_dt = this.detail['inv_dt'];
        const payment_term_id = this.detail['payment_term_id'];
        const total_due = this.detail['sub_tot'];
        if (this.detail['policy_type'] === 'Early' && issue_dt && payment_term_id && total_due) {
            this.financialService.getEarlyPaymentValue(issue_dt, payment_term_id, total_due).subscribe(res => {
                if (res.data) {
                    this.detail['policy_des'] = res.data.expires_dt;
                }
            });
        }
    }
    updatePOD() {
        const date = this.detail['pod_sign_off_date'];
        if (date) {
            const modalRef = this.modalService.open(ConfirmModalContent, { size: 'lg', windowClass: 'modal-md' });
            modalRef.result.then(res => {
                if (res) {
                    this.updatePODPopUp();
                }
            }, dismiss => {

            });
            modalRef.componentInstance.message = 'There is POD Date in the Invoice. Do you want to update it?';
            modalRef.componentInstance.yesButtonText = 'Yes';
            modalRef.componentInstance.noButtonText = 'No';
        } else {
            this.updatePODPopUp();
        }
    }

    updatePODPopUp() {
        const modalRef = this.modalService.open(PODModalComponent, { size: 'sm' });
        modalRef.result.then(res => {
            if (res) {
                this.ngOnInit();
            }
        }, dismiss => { });
        modalRef.componentInstance.invoiceId = this._invoiceId;
    }

    selectTab(id) {
        this.parent.selectTab(id);
    }
    changeShortcut() {
        setTimeout(() => {
            this.parent.data['shortcut'] = this.keyService.getKeys();
        });
    }
    changeTab(step) {
        this.data['tab'].active = +this.parent.tabSet.activeId;
        this.data['tab'].active += step;
        this.data['tab'].active = Math.min(Math.max(this.data['tab'].active, 0), 7);
        this.parent.selectTab(String(this.data['tab'].active));
    }
}
