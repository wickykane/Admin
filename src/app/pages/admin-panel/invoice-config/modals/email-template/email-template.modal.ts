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

    constructor(
        public activeModal: NgbActiveModal,
        private modalService: NgbModal,
        private toastr: ToastrService,
        private invoiceService: InvoiceConfigService
    ) {}

    ngOnInit() {
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
                this.activeModal.close(true);
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
            res => {},
            dismiss => {
                // jQuery("body").addClass("modal-open");
            }
        );
    }

    getEmailTemplate(event) {
        this.emailTemplate = event;
    }
}
