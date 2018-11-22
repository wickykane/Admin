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

import { environment } from '../../../../../../environments/environment';
import { JwtService } from '../../../../../shared/guard/jwt.service';

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
    public currentSelectedFormValue = {
        year: null,
        customer_type: null
    };

    constructor(public router: Router,
        private jwtService: JwtService,
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
                    this.currentSelectedFormValue = { ...this.reportForm.value };
                    this.refresh();
                } catch (err) {
                    console.log(err);
                }
            }, err => {
                console.log(err);
            }
        );
    }

    onSendMail() {
        const modalRef = this.modalService.open(SendMailModalContent, {
            size: 'lg'
        });
        modalRef.result.then(result => {
            if (result) {
                const params = { ...result, ...this.currentSelectedFormValue };
                params['type'] = params['type'] ? params['type'].toLowerCase() : null;
                Object.keys(params).forEach((key) => (params[key] === null || params[key] === '') && delete params[key]);
                this.reportsService.sendMailCustomerOutstanding(params).subscribe(
                    res => {
                        try {
                        } catch (err) {
                            console.log(err);
                        }
                    }
                );
            }
        }, dismiss => {
        });
    }

    exportDocument(type) {
        const anchor = document.createElement('a');
        const path = 'customer-report/customer-exports';
        let file = `${environment.api_url}${path}?type=${type}`;
        file += this.currentSelectedFormValue.year ? `&year=${this.currentSelectedFormValue.year}` : '';
        file += this.currentSelectedFormValue.customer_type ? `&customer_type=${this.currentSelectedFormValue.customer_type}` : '';
        const headers = new Headers();
        headers.append('Authorization', 'Bearer ' + this.jwtService.getToken());
        fetch(file, { headers })
            .then(response => response.blob())
            .then(blobby => {
            const objectUrl = window.URL.createObjectURL(blobby);
            anchor.href = objectUrl;
            anchor.download = `customer_outstanding_report.${type === 'excel' ? 'xls' : 'pdf'}`;
            anchor.click();
            window.URL.revokeObjectURL(objectUrl);
        });
    }
}
