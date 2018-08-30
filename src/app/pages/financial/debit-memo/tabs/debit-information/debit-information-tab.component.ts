import { Component, EventEmitter, Input, OnInit, Output, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { ConfirmModalContent } from '../../../../../shared/modals/confirm.modal';
import { TableService } from './../../../../../services/table.service';


@Component({
    selector: 'app-debit-info-tab',
    templateUrl: './debit-information-tab.component.html',
    styleUrls: ['./debit-information-tab.component.scss'],
    providers: []
})
export class DebitInformationTabComponent implements OnInit {

    public debitData;

    @Input() set debitInfo(debit) {
        if (debit) {
            this.debitData = debit;
            this.getUniqueTaxItemLine();
        }
    }

    public listTaxs = [];

    constructor(
        public toastr: ToastrService,
        public fb: FormBuilder,
        private vRef: ViewContainerRef,
        private router: Router,
        private modalService: NgbModal,
        public tableService: TableService) {
    }

    ngOnInit() {
        this.getUniqueTaxItemLine();
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

    onClickBack() {
        window.history.back();
    }

    onUpdateDebit() {}
}
