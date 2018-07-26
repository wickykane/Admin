import { Component, Input, OnInit } from "@angular/core";
import { Form, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";

import { SendSampleModalContent } from "../send-sample/send-sample.modal";

@Component({
    selector: "app-email-template-modal-content",
    templateUrl: "./email-template.modal.html",
    styleUrls: ["./email-template.modal.scss"]
})
// tslint:disable-next-line:component-class-suffix
export class EmailTemplateModalContent implements OnInit {
    @Input() duration;

    public emailTemplate = null;

    constructor(
        public activeModal: NgbActiveModal,
        private modalService: NgbModal
    ) {}

    ngOnInit() {}

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
