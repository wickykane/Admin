
import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { routerTransition } from '../../../router.animations';
import { InvoiceConfigService } from './invoice-chasing-config.service';
import { EmailTemplateModalContent } from './modals/email-template/email-template.modal';

import { InvoiceConfigKeyService } from './keys.control';

@Component({
    selector: 'app-invoice-config',
    templateUrl: 'invoice-config.component.html',
    providers: [InvoiceConfigService, InvoiceConfigKeyService],
    styleUrls: ['./invoice-config.component.scss'],
    animations: [routerTransition()]
})
export class InvoiceConfigComponent implements OnInit {
    /**
     *  Variable
     */
    public invoiceForm: FormGroup;

    public listMaster = {
        reminderOptions: [
            { value: '1', label: 'By days' },
            { value: '2', label: 'Once a week' },
            { value: '3', label: 'Once a month' }
        ],
        daysOfWeek: [
            { value: '1', label: 'Monday' },
            { value: '2', label: 'Tuesday' },
            { value: '3', label: 'Wednesday' },
            { value: '4', label: 'Thursday' },
            { value: '5', label: 'Friday' },
            { value: '6', label: 'Saturday' },
            { value: '0', label: 'Sunday' }
        ],
        daysOfMonth: [
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15,
            16,
            17,
            18,
            19,
            20,
            21,
            22,
            23,
            24,
            25,
            26,
            27,
            28,
            29,
            30,
            31
        ]
    };
    public applyChaseOption = '1';
    public isProcessingRequest = false;

    constructor(
        private fb: FormBuilder,
        private toastr: ToastrService,
        private modalService: NgbModal,
        private invoiceService: InvoiceConfigService,
        public keyService: InvoiceConfigKeyService
    ) {
        this.invoiceForm = fb.group({
            beforeOn: [false],
            beforeRemind: [0],
            onDueDateOn: [false],
            afterDueDateOn: [false],
            afterRemindFrequency: [null],
            afterRemindValue: [null]
        });
        this.keyService.watchContext.next(this);
    }

    ngOnInit() {
        this.getInvoiceChaseInfo();
    }

    /**
     * Table Event
     */

    selectData(index) {
    }

    /**
     * Internal Function
     */
    onChangeFrequency() {
        this.invoiceForm.controls.afterRemindFrequency
            ? this.invoiceForm.controls.afterRemindValue.setValue('1')
            : this.invoiceForm.controls.afterRemindValue.setValue(null);
    }

    editEmailTemplate(duration) {
        const modalRef = this.modalService.open(EmailTemplateModalContent, {
            size: 'lg'
        });
        modalRef.componentInstance.duration = duration;
        modalRef.result.then(res => {
            // this.getInvoiceChaseInfo();
        }, dismiss => {});
    }

    getInvoiceChaseInfo() {
        this.invoiceService.getInvoiceConfigInfo().subscribe(
            res => {
                try {
                    let index = 0;
                    // Apply for
                    index = res.data.rows.findIndex(item => item.config_key === 'apply_chase_for');
                    this.applyChaseOption = res.data.rows[index][
                        'config_value'
                    ].toString();
                    // Before Due Date
                    index = res.data.rows.findIndex(item => item.config_key === 'before_due_date');
                    this.invoiceForm.controls['beforeOn'].setValue(
                        res.data.rows[index]['config_value']['enable'] === 1
                            ? true
                            : false
                    );
                    this.invoiceForm.controls['beforeRemind'].setValue(
                        res.data.rows[index]['config_value']['send_reminder']
                    );
                    // On Due Date
                    index = res.data.rows.findIndex(item => item.config_key === 'on_due_date');
                    this.invoiceForm.controls['onDueDateOn'].setValue(
                        res.data.rows[index]['config_value']['enable'] === 1
                            ? true
                            : false
                    );
                    // After Due Date
                    index = res.data.rows.findIndex(item => item.config_key === 'after_due_date');
                    this.invoiceForm.controls['afterDueDateOn'].setValue(
                        res.data.rows[index]['config_value']['enable'] === 1
                            ? true
                            : false
                    );
                    this.invoiceForm.controls['afterRemindFrequency'].setValue(
                        res.data.rows[index]['config_value']['send_reminder_key']
                    );
                    this.invoiceForm.controls['afterRemindValue'].setValue(
                        res.data.rows[index]['config_value']['send_reminder_value']
                    );
                } catch (err) {
                    console.log(err);
                }
            },
            err => {
                console.log(err);
            }
        );
    }

    onSave() {
        this.isProcessingRequest = true;
        if ( this.invoiceForm.value.afterRemindFrequency != null && this.invoiceForm.value.afterRemindFrequency !== 'null') {
            const params = {
                'apply_chase_for': this.applyChaseOption,
                'before_due_date':
                {
                    'enable': this.invoiceForm.value['beforeOn'] ? 1 : 0,
                    'send_reminder': this.invoiceForm.value['beforeRemind'] ? this.invoiceForm.value['beforeRemind'] : 0
                },
                'on_due_date':
                {
                    'enable': this.invoiceForm.value['onDueDateOn'] ? 1 : 0
                },
                'after_due_date':
                {
                    'enable': this.invoiceForm.value['afterDueDateOn'] ? 1 : 0,
                    'send_reminder_key': this.invoiceForm.value['afterRemindFrequency'],
                    'send_reminder_value': this.invoiceForm.value['afterRemindValue']
                }
            };
            if (params['after_due_date']['send_reminder_key'] === '1' && params['after_due_date']['send_reminder_value'] < 1) {
                this.toastr.clear();
                this.toastr.error('The day number to send reminder after due date must be great than 0');
                setTimeout(() => {
                    this.isProcessingRequest = false;
                }, 1000);
            } else {
                this.invoiceService.saveInvoiceConfigInfo(params)
                .finally(() => {
                    setTimeout(() => {
                        this.isProcessingRequest = false;
                    }, 1000);
                })
                .subscribe(
                    res => {
                        this.toastr.success(res.message);
                        // this.getInvoiceChaseInfo();
                        setTimeout(() => {
                            window.history.back();
                        }, 500);
                    },
                    err => {
                        console.log(err.message);
                });
            }
        } else {
            this.toastr.clear();
            this.toastr.error('Please select reminder frequency!');
            setTimeout(() => {
                this.isProcessingRequest = false;
            }, 1000);
        }
    }
}
