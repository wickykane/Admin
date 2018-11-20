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

import * as _ from 'lodash';

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
                    this.reportData = res.data.list || [];
                    this.summaryData = [];
                    if (res.data.summary.length) {
                        res.data.summary.forEach(data => this.summaryData.push(_.values(data)));
                    }
                    this.refresh();
                } catch (err) {
                    console.log(err);
                }
            }, err => {
                console.log(err);
            }
        );
    }

    onSendMail(type) {
        const modalRef = this.modalService.open(SendMailModalContent, {
            size: 'lg'
        });
        modalRef.componentInstance.type = type;
        modalRef.result.then(result => {
            if (result) {
                const params = {};
                this.reportsService.sendMailCustomerOutstanding(params).subscribe(
                    res => {
                        try {
                            console.log(res);
                        } catch (err) {
                            console.log(err);
                        }
                    }
                );
            }
        }, dismiss => {
        });
    }

    exportExcel() {
        const params = {};
        this.reportsService.exportExcelCustomerOutstanding(params).subscribe(
            res => {
                try {
                    console.log(res);
                } catch (err) {
                    console.log(err);
                }
            }
        );
    }

    exportPDF() {
        const params = {};
        this.reportsService.exportPDFCustomerOutstanding(params).subscribe(
            res => {
                try {
                    console.log(res);
                } catch (err) {
                    console.log(err);
                }
            }
        );
    }

    downloadExcel() {
        window.open('https://docs.google.com/spreadsheets/d/1VTs6QVwx6QQeTt-IMvwXzcYUcYGX-8ER8tO0_-RYaxM/export?format=xlsx', '_blank');
    }

    downloadPDF() {
        window.open('https://drive.google.com/uc?export=download&id=1UyKUTfjHtPIjsnEcLRhJuoWoM3gpsmtz', '_blank');
    }
}
