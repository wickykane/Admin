import { Component, Input, OnInit } from "@angular/core";
import { Form, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";

@Component({
    selector: "app-email-template-modal-content",
    templateUrl: "./email-template.modal.html",
    styleUrls: ["./email-template.modal.scss"]
})
// tslint:disable-next-line:component-class-suffix
export class EmailTemplateModalContent implements OnInit {
    @Input() duration;

    constructor(public activeModal: NgbActiveModal) {}

    ngOnInit() {}
}
