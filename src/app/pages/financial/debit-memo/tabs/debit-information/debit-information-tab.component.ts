import { Component, EventEmitter, Inject, Input, OnInit, Output, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { ConfirmModalContent } from '../../../../../shared/modals/confirm.modal';
import { TableService } from './../../../../../services/table.service';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';
import { StorageService } from '../../../../../services/storage.service';
import { FinancialService } from '../../../financial.service';
import { DebitMemoService } from '../../debit-memo.service';

import { HotkeysService } from 'angular2-hotkeys';
import { DebitMemoViewComponent } from '../../view/debit-memo-view.component';
import { DebitMemoViewKeyService } from '../../view/keys.view.controls';

@Component({
    selector: 'app-debit-info-tab',
    templateUrl: './debit-information-tab.component.html',
    styleUrls: ['./debit-information-tab.component.scss'],
    providers: [DebitMemoService]
})
export class DebitInformationTabComponent implements OnInit {

    public debitData = {};
    public data = {};

    @Input() set debitInfo(debit) {
        if (debit) {
            this.debitData = debit;
             this.listTaxs = this.debitData['tax_info'];
            // this.getUniqueTaxItemLine();
        }
    }
    @Output() changeStatusSuccessfully = new EventEmitter();

    public listTaxs = [];
    public currentuser = {};

    public isInstallQuickbook = false;
    public listMaster = {};

    constructor(
        public toastr: ToastrService,
        public fb: FormBuilder,
        private vRef: ViewContainerRef,
        private router: Router,
        private modalService: NgbModal,
        public tableService: TableService,
        public debitService: DebitMemoService,
        private _hotkeysService: HotkeysService,
        public keyService: DebitMemoViewKeyService,
        public financialService: FinancialService,
        private storage: StorageService,
        @Inject(DebitMemoViewComponent) private parent: DebitMemoViewComponent,
        private http: HttpClient) {
        //  Init Key
        if (!this.parent.data['shortcut']) {
            this.keyService.watchContext.next({ context: this, service: this._hotkeysService });
        }
    }

    ngOnInit() {
        this.currentuser = JSON.parse(localStorage.getItem('currentUser'));
        this.getQuickbookSettings();
        // this.getUniqueTaxItemLine();
        // this.listTaxs = this.debitData['tax_info'];
        // console.log(this.listTaxs);
        this.data['tab'] = {
            active: 0,
        };
        this.changeShortcut();
        this.listMaster['permission'] = this.storage.getRoutePermission(this.router.url);
    }

    getUniqueTaxItemLine() {
        if (this.debitData['line_items'].length) {
            this.listTaxs = _.uniq(this.debitData['line_items'].map(item => parseFloat(item.tax_percent)))
                .map( item => {
                    return {tax_percent: item, amount: 0};
            });

            let total_tax = 0;
            this.listTaxs.forEach(taxItem => {
                this.debitData['line_items'].forEach(item => {
                    taxItem.amount += (parseFloat(item.tax_percent) === taxItem.tax_percent) ? item.tax : 0;
                });
                total_tax += taxItem.amount;
            });
        }
    }

    getQuickbookSettings() {
        this.financialService.getSettingInfoQuickbook().subscribe(
            res => {
                this.isInstallQuickbook = res.data.state === 'authorized' ? true : false;
            }, err => {}
        );
    }

    onClickEdit() {
        this.router.navigate(['/financial/debit-memo/edit',  this.debitData['id']]);
    }

    onChangeDebitStatus(newStatus) {
        let modalMessage = '';
        switch (newStatus) {
            case 1: {
                modalMessage = 'Are you sure that you want to reopen the current debit memo?';
                break;
            }
            case 2: {
                modalMessage = 'Are you sure that you want to submit this debit memo to approver?';
                break;
            }
            case 3: {
                modalMessage = 'Are you sure that you want to approve the current debit memo?';
                break;
            }
            case 4: {
                modalMessage = 'Are you sure that you want to reject the current debit memo?';
                break;
            }
            case 5: {
                modalMessage = 'Are you sure that you want to cancel current debit memo?';
                break;
            }
        }
        const modalRef = this.modalService.open(ConfirmModalContent);
            modalRef.componentInstance.message = modalMessage;
            modalRef.componentInstance.yesButtonText = 'YES';
            modalRef.componentInstance.noButtonText = 'NO';
            modalRef.result.then(yes => {
                if (yes) {
                    this.doUpdateDebitStatus(newStatus);
                }
            }, no => { });
    }

    doUpdateDebitStatus(newStatus) {
        this.debitService.updateDebitMemoStatus(this.debitData['id'], newStatus).subscribe(
            res => {
                try {
                    this.toastr.success(res.message);
                    if (newStatus === 3 && this.isInstallQuickbook) {
                        this.financialService.syncDebitToQuickbook(this.debitData['id']).subscribe(
                            _res => {
                                try {
                                    const result = JSON.parse(_res['_body']);
                                    this.toastr.success(`Debit Memo ${result.data[0].entity.DocNumber} has been sync to Quickbooks successfully.`);
                                } catch (err) {}
                            },
                            err => {
                                this.toastr.error(`Cannot sync Debit Memo to Quickbooks.`);
                            }
                        );
                    }
                    this.changeStatusSuccessfully.emit();
                } catch (err) {
                    console.log(err);
                }
            }, err => {
                console.log(err);
            }
        );
    }

    onPrintDebitMemo() {
        const path = `debit/${this.debitData['id']}/print-pdf`;
        const url = `${environment.api_url}${path}`;
        const headers: HttpHeaders = new HttpHeaders({ 'Authorization': 'Bearer ' + localStorage.getItem('id_token') });
        this.http.get(url, {
            headers,
            responseType: 'blob',
        }).subscribe(res => {
            const newWindow = window.open(`assets/pdfjs/web/viewer.html?openFile=false&encrypt=true&fileName=${this.debitData['no']}.pdf&file=${btoa(url)}`, '_blank');
            newWindow.document.title = this.debitData['no'];
            newWindow.focus();
        });
    }

    onClickBack() {
        this.router.navigate(['/financial/debit-memo']);
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

    cancel() {
        this.router.navigate(['/financial/debit-memo']);
    }
}
