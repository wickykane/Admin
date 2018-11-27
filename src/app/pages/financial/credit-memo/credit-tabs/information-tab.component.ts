import { Component, EventEmitter, Inject, Input, OnInit, Output, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CreditMemoService } from '../credit-memo.service';
import { TableService } from './../../../../services/table.service';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../../environments/environment';
import { StorageService } from '../../../../services/storage.service';
import { ConfirmModalContent } from '../../../../shared/modals/confirm.modal';
import { FinancialService } from '../../financial.service';
import { CreditMailModalComponent } from '../modals/send-email/mail.modal';

import { HotkeysService } from 'angular2-hotkeys';
import { CreditMemoDetailComponent } from '../view/credit-memo-view.component';
import { CreditDetailKeyService } from '../view/keys.view.control';
@Component({
    selector: 'app-credit-info-tab',
    templateUrl: './information-tab.component.html',
    styleUrls: ['./invoice-tab.component.scss'],
    providers: [CreditMemoService]
})
export class CreditInformationTabComponent implements OnInit {

    /**
     * letiable Declaration
     */

    public _creditId;
    @Input() set creditId(id) {
        if (id) {
            this._creditId = id;
        }
    }
    public data = {};

    public messageConfig = {
        '2': 'Are you sure that you want to submit this credit memo?',
        '5': 'Are you sure that you want to cancel this credit memo?',
        'RE-OPEN': 'Are you sure that you want to reopen the credit memo?',
        '3': 'Are you sure that you want to approve the current credit memo?',
        '4': 'Are you sure that you want to reject the current credit memo?'
    };


    public detail: any = {
        'contact_user': {},
        'billing': {},
        'shipping_address': {},
        'items': [],
        'company': {}
    };

    public isInstallQuickbook = false;
    public listMaster = {};

    constructor(
        public toastr: ToastrService,
        public fb: FormBuilder,
        private vRef: ViewContainerRef,
        private router: Router,
        private modalService: NgbModal,
        private creditMemoService: CreditMemoService,
        public financialService: FinancialService,
        public tableService: TableService,
        private _hotkeysService: HotkeysService,
        public keyService: CreditDetailKeyService,
        private storage: StorageService,
        @Inject(CreditMemoDetailComponent) private parent: CreditMemoDetailComponent,
        private http: HttpClient) {
            //  Init Key
        if (!this.parent.data['shortcut']) {
            this.keyService.watchContext.next({ context: this, service: this._hotkeysService });
        }
    }

    ngOnInit() {
        this.getList();
        this.getQuickbookSettings();
        this.detail['taxs'] = [];
        this.data['tab'] = {
            active: 0,
        };
        this.changeShortcut();
        this.listMaster['permission'] = this.storage.getRoutePermission(this.router.url);
    }

    /**
     * Internal Function
     */
    sendMail(id) {
        const modalRef = this.modalService.open(CreditMailModalComponent, { size: 'lg', windowClass: 'modal-md' });
        modalRef.result.then(res => {
        }, dismiss => { });
        modalRef.componentInstance.creditId = id;
    }

    getQuickbookSettings() {
        this.financialService.getSettingInfoQuickbook().subscribe(
            res => {
                this.isInstallQuickbook = res.data.state === 'authorized' ? true : false;
            }, err => {}
        );
    }

    printPDF(id) {
        const path = 'credit-memo/export-print-pdf/';
        const url = `${environment.api_url}${path}${id}`;
        const headers: HttpHeaders = new HttpHeaders({ 'Authorization': 'Bearer ' + localStorage.getItem('id_token') });
        this.http.get(url, {
            headers,
            responseType: 'blob',
        }).subscribe(res => {
            const newWindow = window.open(`assets/pdfjs/web/viewer.html?openFile=false&encrypt=true&fileName=CreditMemo.pdf&file=${btoa(url)}`, '_blank');
            newWindow.document.title = 'CreditMemo';
            newWindow.focus();
        });
    }


    getList() {
        this.creditMemoService.getDetailCreditMemo(this._creditId).subscribe(res => {
            try {
                this.detail = res.data;
                this.detail.items = this.detail.items || [];
                this.detail.contact_user = res.data.contact_user || [];
                this.detail.shipping_address = res.data.shipping || [];
                this.detail.billing = res.data.billing || [];
                // this.updateTotal();
            } catch (e) {
                console.log(e);
            }
        });
    }

    groupTax(items) {
        this.detail['taxs'] = [];
        this.detail['total_tax'] = 0;
        const taxs = items.map(item => item.tax_percent || 0);
        const unique = taxs.filter((i, index) => taxs.indexOf(i) === index);
        unique.forEach((tax, index) => {
            let taxAmount = 0;
            items.filter(item => item.tax_percent === tax).map(i => {
                taxAmount += (+i.tax_percent * +i.quantity * ((+i.price || 0) * (100 - (+i.discount_percent || 0)) / 100) / 100);
            });
            this.detail['total_tax'] = this.detail['total_tax'] + +taxAmount.toFixed(2);
            this.detail['taxs'].push({
                value: tax, amount: taxAmount.toFixed(2)
            });
        });
    }

    updateTotal() {
        this.detail.total = 0;
        this.detail.sub_total = 0;
        this.groupTax(this.detail.items);

        this.detail.items.forEach(item => {
            const amount = (+item.quantity * (+item.price || 0)) * (100 - (+item.discount_percent || 0)) / 100;
            this.detail.sub_total += amount;
        });
        this.detail.total = (+this.detail['total_tax'] || 0) + +this.detail.sub_total;
        if (this.detail.incentive_percent) {
            this.detail.incentive = +this.detail.incentive_percent * +this.detail.total / 100;
        }
        this.detail.grand_total = +this.detail.total - +this.detail.incentive;
    }


    updateStatus(id, status) {
        const params = { credit_id: id, status };
        this.creditMemoService.updateCreditStatus(params).subscribe(res => {
            try {
                this.toastr.success(res.message);
                if (status === 3 && this.isInstallQuickbook) {
                    this.financialService.syncCreditToQuickbook(id).subscribe(
                        _res => {
                            try {
                                const result = JSON.parse(_res['_body']);
                                this.toastr.success(`Credit Memo ${result.data[0].entity.DocNumber} has been sync to Quickbooks successfully.`);
                            } catch (err) {}
                        },
                        err => {
                            this.toastr.error(`Cannot sync Credit Memo to Quickbooks.`);
                        }
                    );
                }
                this.getList();
            } catch (e) {
                console.log(e);
            }
        });
    }

    reopentCredit(id) {
        this.creditMemoService.reopenCredit(id).subscribe(res => {
            try {
                this.toastr.success(res.message);
                this.getList();
            } catch (e) {
                console.log(e);
            }
        });
    }

    confirmModal(id, status) {
        console.log(id);
        const modalRef = this.modalService.open(ConfirmModalContent, { size: 'lg', windowClass: 'modal-md' });
        modalRef.result.then(res => {
            if (res) {
                if (status === 'RE-OPEN') {
                    this.reopentCredit(id);
                    return;
                }
                this.updateStatus(id, status);
            }
        }, dismiss => { });
        modalRef.componentInstance.message = this.messageConfig[status];
        modalRef.componentInstance.yesButtonText = 'Yes';
        modalRef.componentInstance.noButtonText = 'No';
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

    back() {
        this.router.navigate(['/financial/credit-memo']);
    }
}
