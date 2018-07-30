import { Component, Input, OnInit } from "@angular/core";
import { Form, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";

@Component({
    selector: "app-send-sample-modal-content",
    templateUrl: "./send-sample.modal.html",
    styleUrls: ["./send-sample.modal.scss"]
})
// tslint:disable-next-line:component-class-suffix
export class SendSampleModalContent implements OnInit {

    public receiverEmail = "";

    constructor(public activeModal: NgbActiveModal) {}

    ngOnInit() {}

    onSendSample(){
        this.activeModal.close({
            receiver: this.receiverEmail
        });
    }
}
