import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { InvoiceConfigService } from "../../invoice-chasing-config.service";

import { SendSampleModalContent } from "../send-sample/send-sample.modal";

@Component({
    selector: "app-email-template-modal-content",
    templateUrl: "./email-template.modal.html",
    providers: [InvoiceConfigService],
    styleUrls: ["./email-template.modal.scss"]
})
// tslint:disable-next-line:component-class-suffix
export class EmailTemplateModalContent implements OnInit {
    @Input() duration;

    public emailTemplate = {
        email_tpl: {
            subject: "",
            body: ""
        }
    };

    public emailTemplateForDisplay = {
        subject: "",
        body: ""
    };

    public fieldTags = [];

    constructor(
        public activeModal: NgbActiveModal,
        private modalService: NgbModal,
        private toastr: ToastrService,
        private invoiceService: InvoiceConfigService
    ) {}

    ngOnInit() {
        this.getFieldTags();
        this.getTemplateFromAPI();
    }

    getTemplateFromAPI() {
        let  key = "";
        switch(this.duration) {
            case "BEFORE": {
                key = "before_due_date";
                break;
            }
            case "ON": {
                key = "on_due_date";
                break;
            }
            case "AFTER": {
                key = "after_due_date";
                break;
            }
        }
        this.invoiceService.getEmailTemplate(key).subscribe(
            res => {
                this.emailTemplate = res.data.config_value;
            },
            err => {
                console.log(err)
            }
        );
    }

    getFieldTags() {
        this.invoiceService.getFieldTags().subscribe(
            res => {
                this.fieldTags = [];
                res.data.config_value.forEach(item => {
                    let label = Object.keys(item)[0].toString().replace("{@@","%%").replace("@@}","%%").replace(/_/g,"").toUpperCase();
                    this.fieldTags.push({
                        tag: Object.keys(item)[0],
                        value: Object.values(item)[0],
                        label: label
                    })
                });
            },
            err => {
                console.log(err);
            }
        );
    }

    saveTemplate() {
        let id = 0;
        switch(this.duration) {
            case "BEFORE": {
                id = 12;
                break;
            }
            case "ON": {
                id = 13;
                break;
            }
            case "AFTER": {
                id = 14;
                break;
            }
        }
        let params = {
            "config_value": this.emailTemplate
        };
        this.invoiceService.saveEmailTemplate(id, params).subscribe(
            res => {
                this.toastr.success("Save successfully");
            },
            err => {
                console.log(err);
            }
        );
    }

    sendSampleEmail() {
        const modalRef = this.modalService.open(SendSampleModalContent, {
            size: "sm",
            centered: true,
            backdrop: "static"
        });
        modalRef.result.then(
            res => {
                if(res && res.receiver) {
                    let params = {
                        "email_to": res.receiver,
                        "email_subject": this.emailTemplate.email_tpl.subject,
                        "email_body": this.emailTemplate.email_tpl.body
                    };
                    this.invoiceService.sendEmailSample(params).subscribe(
                        res => {
                            this.toastr.success("Email has been sent successfully.");
                        },
                        err => {
                            console.log(err);
                        }
                    );
                }
                else {
                    this.toastr.warning("Receiver's can not be empty.");
                }
            },
            dismiss => {
                // jQuery("body").addClass("modal-open");
            }
        );
    }

    getEmailTemplate(event) {
        this.emailTemplate = event;
        this.emailTemplateForDisplay = event.email_tpl;
    }
}
