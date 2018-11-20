import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TableService } from './../../../../../services/table.service';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HotkeysService } from 'angular2-hotkeys';
import { ToastrService } from 'ngx-toastr';

import { routerTransition } from '../../../../../router.animations';

import { SendMailModalContent } from '../../modals/send-mail/send-mail.modal';

import { ReportsService } from '../../../reports.service';

@Component({
    selector: 'app-customer-outstanding',
    templateUrl: './customer-outstanding.component.html',
    styleUrls: ['../reports.scss', './customer-outstanding.component.scss'],
    animations: [routerTransition()],
    providers: [ReportsService],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerOutstandingComponent implements OnInit {

    /**
     * letiable Declaration
     */

    public listMaster = {
        reportPeriods: [],
        customerTypes: []
    };
    public reportData = [];
    public summaryData = [];
    public showContextMenu = false;

    public user: any;
    public reportForm: FormGroup;

    constructor(public router: Router,
        public fb: FormBuilder,
        public toastr: ToastrService,
        public tableService: TableService,
        public modalService: NgbModal,
        private reportsService: ReportsService,
        private cd: ChangeDetectorRef) {
        this.reportForm = fb.group({
            'year': [null],
            'customer_type': [null]
        });
    }

    ngOnInit() {
        this.user = JSON.parse(localStorage.getItem('currentUser'));
        this.getMasterData();
    }

    refresh() {
        if (!this.cd['destroyed']) { this.cd.detectChanges(); }
    }

    getMasterData() {
        this.reportsService.getCustomerOutstandingMasterData().subscribe(
            res => {
                try {
                    this.listMaster['reportPeriods'] = [ ...[{ year: null }], ...res.data.year || [] ];
                    this.listMaster['customerTypes'] = res.data.company_type || [];
                    this.refresh();
                } catch (err) {
                    console.log(err);
                }
            }, err => {
                console.log(err);
            }
        );
    }

    getCustomerOutstandingReportData() {
        const params = { ...this.reportForm.value };
        Object.keys(params).forEach((key) => (params[key] === null || params[key] === '') && delete params[key]);
        this.reportsService.getCustomerOutstandingReport(params).subscribe(
            res => {
                try {
                    this.reportData = res.data || [];
                    this.getSummaryCompanyData();
                    this.refresh();
                } catch (err) {
                    console.log(err);
                }
            }, err => {
                console.log(err);
            }
        );
    }

    getSummaryCompanyData() {
        this.summaryData = [
            {
                'type': 'Invoice',
                'due30': 3000.00,
                'due60': 0.00,
                'due90': 0.00,
                'due120': 0.00,
                'balance': 3000.00
            },
            {
                'type': 'Debit',
                'due30': 0.00,
                'due60': 0.00,
                'due90': 0.00,
                'due120': 1000.00,
                'balance': 1000.00
            },
            {
                'type': 'Credit',
                'due30': 500.00,
                'due60': 0.00,
                'due90': 0.00,
                'due120': 0.00,
                'balance': 500.00
            }
        ];
    }

    calculateBalance(data) {
        const totalBalance = data.reduce(
            (
                (initialValue, item) => initialValue + item.balance_amount * (item['doc_type'] === 'Credit Memo' ? -1 : 1)
            ), 0
        );
        return totalBalance;
    }

    calculateToTalBalance(customer) {
        const totalParentBalance = this.calculateBalance(customer.content);
        const totalChildBalance = (customer.child && customer.child.length) ?
            customer.child.reduce(((initialValue, childItem) => initialValue + this.calculateBalance(childItem.content)), 0) : 0;
        return totalParentBalance + totalChildBalance;
    }

    calculateTotalSummaryBalance() {
        const totalBalance = this.summaryData.reduce(((initialValue, item) => initialValue + item.balance), 0);
        return totalBalance;
    }

    calculateTotalBalanceReport() {
        const totalBalanceReport = this.reportData.reduce(((initialValue, customer) => initialValue + this.calculateToTalBalance(customer)), 0);
        return totalBalanceReport;
    }

    onSendMail(type) {
        const modalRef = this.modalService.open(SendMailModalContent, {
            size: 'lg'
        });
        modalRef.componentInstance.type = type;
        modalRef.result.then(res => {
        }, dismiss => {
        });
    }

    downloadExcel() {
        window.open('https://docs.google.com/spreadsheets/d/1VTs6QVwx6QQeTt-IMvwXzcYUcYGX-8ER8tO0_-RYaxM/export?format=xlsx', '_blank');
    }

    downloadPDF() {
        window.open('https://drive.google.com/uc?export=download&id=1UyKUTfjHtPIjsnEcLRhJuoWoM3gpsmtz', '_blank');
    }
}
