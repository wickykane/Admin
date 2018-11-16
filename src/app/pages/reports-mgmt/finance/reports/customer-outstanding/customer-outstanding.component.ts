import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TableService } from './../../../../../services/table.service';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HotkeysService } from 'angular2-hotkeys';
import { ToastrService } from 'ngx-toastr';

import { routerTransition } from '../../../../../router.animations';

import { SendMailModalContent } from '../../modals/send-mail/send-mail.modal';

@Component({
    selector: 'app-customer-outstanding',
    templateUrl: './customer-outstanding.component.html',
    styleUrls: ['../reports.scss', './customer-outstanding.component.scss'],
    animations: [routerTransition()],
    providers: [],
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
        private cd: ChangeDetectorRef) {
        this.reportForm = fb.group({
            'period': [null],
            'type': [null]
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
        this.listMaster['reportPeriods'] = [
            { key: null, value: 'All Years' },
            { key: '2018', value: '2018' },
            { key: '2017', value: '2017' },
            { key: '2016', value: '2016' }
        ];
        this.listMaster['customerTypes'] = [
            { key: 'com', value: 'Company' },
            { key: 'per', value: 'Personal' }
        ];
    }

    getCompanyReportData() {
        this.reportData = [
            {
                name: 'Khiet Pham Parent Company',
                data: [
                    {
                        type: 'Invoice',
                        no: 'INV-0101-0000001',
                        issue_date: '01/01/2018',
                        due_date: '01/01/2018',
                        day_of_outstanding: '0',
                        total_amount: '1000.00',
                        total_balance: 1000.00
                    },
                    {
                        type: 'Debit Memo',
                        no: 'DR-0101-0000002',
                        issue_date: '01/01/2017',
                        due_date: '01/01/2017',
                        day_of_outstanding: '365',
                        total_amount: '1000.00',
                        total_balance: 1000.00
                    },
                    {
                        type: 'Credit Memo',
                        no: 'CR-MMDD-0000001',
                        issue_date: '01/01/2018',
                        due_date: '',
                        day_of_outstanding: '0',
                        total_amount: '500.00',
                        total_balance: 500.00
                    }
                ],
                child: [
                    {
                        name: 'Khiet Pham Child',
                        data: [
                            {
                                type: 'Invoice',
                                no: 'INV-0101-0000002',
                                issue_date: '01/01/2018',
                                due_date: '01/01/2018',
                                day_of_outstanding: '0',
                                total_amount: '1000.00',
                                total_balance: 1000.00
                            }
                        ]
                    }
                ]
            },
            {
                name: 'Khiet Pham Super Company',
                data: [
                    {
                        type: 'Invoice',
                        no: 'INV-0101-0000003',
                        issue_date: '01/01/2018',
                        due_date: '01/01/2018',
                        day_of_outstanding: '0',
                        total_amount: '1000.00',
                        total_balance: 1000.00
                    },
                ],
                child: []
            }
        ];
    }

    getPersonalReportData() {
        this.reportData = [
            {
                name: 'Khiet Pham',
                data: [
                    {
                        type: 'Invoice',
                        no: 'INV-0101-0000003',
                        issue_date: '01/01/2018',
                        due_date: '01/01/2018',
                        day_of_outstanding: '0',
                        total_amount: '1000.00',
                        total_balance: 1000.00
                    },
                ]
            }
        ];
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

    getSummaryPersonalData() {
        this.summaryData = [
            {
                'type': 'Invoice',
                'due30': 1000.00,
                'due60': 0.00,
                'due90': 0.00,
                'due120': 0.00,
                'balance': 1000
            },
            {
                'type': 'Debit',
                'due30': 0.00,
                'due60': 0.00,
                'due90': 0.00,
                'due120': 0.00,
                'balance': 0.00
            }
        ];
    }

    onRunReport() {
        switch (this.reportForm.value.type) {
            case 'com': {
                this.getCompanyReportData();
                this.getSummaryCompanyData();
                break;
            }
            case 'per': {
                this.getPersonalReportData();
                this.getSummaryPersonalData();
                break;
            }
            default: {
                break;
            }
        }
    }

    calculateBalance(data) {
        const totalBalance = data.reduce(((initialValue, item) => initialValue + item.total_balance), 0);
        return totalBalance;
    }

    calculateToTalBalance(customer) {
        const totalParentBalance = this.calculateBalance(customer.data);
        const totalChildBalance = (customer.child && customer.child.length) ?
            customer.child.reduce(((initialValue, childItem) => initialValue + this.calculateBalance(childItem.data)), 0) : 0;
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
}
