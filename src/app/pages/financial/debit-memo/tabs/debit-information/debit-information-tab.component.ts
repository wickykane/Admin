import { Component, EventEmitter, Input, OnInit, Output, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { ConfirmModalContent } from '../../../../../shared/modals/confirm.modal';
import { TableService } from './../../../../../services/table.service';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';
import { DebitMemoService } from '../../debit-memo.service';

@Component({
    selector: 'app-debit-info-tab',
    templateUrl: './debit-information-tab.component.html',
    styleUrls: ['./debit-information-tab.component.scss'],
    providers: [DebitMemoService]
})
export class DebitInformationTabComponent implements OnInit {

    public debitData = {};

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

    constructor(
        public toastr: ToastrService,
        public fb: FormBuilder,
        private vRef: ViewContainerRef,
        private router: Router,
        private modalService: NgbModal,
        public tableService: TableService,
        public debitService: DebitMemoService,
        private http: HttpClient) {
    }

    ngOnInit() {
        this.currentuser = JSON.parse(localStorage.getItem('currentUser'));
        // this.getUniqueTaxItemLine();
        // this.listTaxs = this.debitData['tax_info'];
        // console.log(this.listTaxs);
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
        const path = `debit/${this.debitData['id']}/print`;
        const url = `${environment.api_url}${path}`;
        const headers: HttpHeaders = new HttpHeaders();
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
}
