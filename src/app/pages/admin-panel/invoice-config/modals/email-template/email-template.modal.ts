import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { InvoiceConfigService } from '../../invoice-chasing-config.service';

import { SendSampleModalContent } from '../send-sample/send-sample.modal';

import { HotkeysService } from 'angular2-hotkeys';
import { EmailTemplateKeyService } from './keys.control';

declare var jQuery: any;
@Component({
    selector: 'app-email-template-modal-content',
    templateUrl: './email-template.modal.html',
    providers: [InvoiceConfigService, EmailTemplateKeyService, NgbModal],
    styleUrls: ['./email-template.modal.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
// tslint:disable-next-line:component-class-suffix
export class EmailTemplateModalContent implements OnInit {
    @Input() duration;

    public emailTemplate = {
        email_tpl: {
            subject: '',
            body: ''
        }
    };

    public emailTemplateForDisplay = {
        subject: '',
        body: ''
    };

    public fieldTags = [];

    private id = null;
    @ViewChild('tabSet') tabSet;
    public data = {};

    constructor(
        private cd: ChangeDetectorRef,
        public activeModal: NgbActiveModal,
        private modalService: NgbModal,
        private toastr: ToastrService,
        private keyService: EmailTemplateKeyService,
        private _hotkeysService: HotkeysService,
        private invoiceService: InvoiceConfigService
    ) {}

    ngOnInit() {
        this.getTemplateFromAPI();
    }

    refresh() {
         if (!this.cd['destroyed']) { this.cd.detectChanges(); }
    }

    getTemplateFromAPI() {
        let  key = '';
        switch (this.duration) {
            case 'BEFORE': {
                key = 'before_due_date';
                break;
            }
            case 'ON': {
                key = 'on_due_date';
                break;
            }
            case 'AFTER': {
                key = 'after_due_date';
                break;
            }
        }
        this.invoiceService.getEmailTemplate(key).subscribe(
            res => {
                this.emailTemplate = res.data.config_value;
                this.id = res.data.id;
                this.getFieldTags();
                this.refresh();
            },
            err => {
                console.log(err);
            }
        );
    }

    getFieldTags() {
        this.invoiceService.getFieldTags().subscribe(
            res => {
                this.fieldTags = [];
                res.data.config_value.forEach(item => {
                    this.fieldTags.push({
                        tag: Object.keys(item)[0],
                        value: item[Object.keys(item)[0]]
                    });
                });
                this.fieldTags.forEach(item => {
                    const regex = new RegExp(item.tag, 'g');
                    this.emailTemplate.email_tpl.subject = this.emailTemplate.email_tpl.subject.replace(regex, item.value);
                    this.emailTemplate.email_tpl.body = this.emailTemplate.email_tpl.body.replace(regex, item.value);
                });
                this.refresh();
            },
            err => {
                console.log(err);
            }
        );
    }

    saveTemplate() {
        const params = {
            subject: this.emailTemplate.email_tpl.subject,
            body: this.emailTemplate.email_tpl.body
        };
        this.fieldTags.forEach(item => {
            const regex = new RegExp(item.value, 'g');
            params.subject = params.subject.replace(regex, item.tag);
            params.body = params.body.replace(regex, item.tag);
        });
        this.invoiceService.saveEmailTemplate(this.id, params).subscribe(
            res => {
                this.toastr.success(res.message);
                this.refresh();
                setTimeout(() => {
                    this.activeModal.close();
                }, 500);
            },
            err => {
                console.log(err);
            }
        );
    }

    sendSampleEmail() {
        this.keyService.saveKeys();
        const modalRef = this.modalService.open(SendSampleModalContent, { size: 'sm' });
        modalRef.result.then(
            res => {
                if (this.keyService.keys.length > 0) {
                    this.keyService.reInitKey();
                }
                jQuery('body').addClass('modal-open');
                if (res && res.receiver) {
                    const params = {
                        'email_to': res.receiver,
                        'email_subject': this.emailTemplate.email_tpl.subject,
                        'email_body': this.emailTemplate.email_tpl.body
                    };
                    this.fieldTags.forEach(item => {
                        const regex = new RegExp(item.value, 'g');
                        params.email_subject = params.email_subject.replace(regex, item.tag);
                        params.email_body = params.email_body.replace(regex, item.tag);
                    });
                    this.invoiceService.sendEmailSample(params).subscribe(
                        _res => {
                            this.toastr.success(_res.message);
                            this.refresh();
                        },
                        err => {
                            console.log(err);
                        }
                    );
                } else {
                    this.toastr.warning('Receiver\'s email can not be empty.');
                }
            },
            dismiss => {
                if (this.keyService.keys.length > 0) {
                    this.keyService.reInitKey();
                }
                jQuery('body').addClass('modal-open');
            }
        );
    }

    getEmailTemplate(event) {
        this.emailTemplate = event;
        this.emailTemplateForDisplay = event.email_tpl;
    }

    selectTab(id) {
        this.tabSet.select(id);
        this.refresh();
    }
}
