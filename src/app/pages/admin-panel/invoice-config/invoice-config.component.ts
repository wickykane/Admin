import { Component, OnInit } from "@angular/core";
import { Form, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { routerTransition } from "../../../router.animations";
import { ConfirmModalContent } from "../../../shared/modals/confirm.modal";
import { EmailTemplateModalContent } from "./modals/email-template.modal";

@Component({
    selector: "app-invoice-config",
    templateUrl: "invoice-config.component.html",
    styleUrls: ["./invoice-config.component.scss"],
    animations: [routerTransition()]
})
export class InvoiceConfigComponent implements OnInit {
    /**
     *  Variable
     */
    public invoiceForm: FormGroup;

    public listMaster = {
        reminderOptions: [
            { value: 1, label: "By days" },
            { value: 2, label: "Once a week" },
            { value: 3, label: "Once a month" }
        ],
        daysOfWeek: [
            { value: 1, label: "Monday" },
            { value: 2, label: "Tuesday" },
            { value: 3, label: "Wednesday" },
            { value: 4, label: "Thursday" },
            { value: 5, label: "Friday" },
            { value: 6, label: "Saturday" },
            { value: 0, label: "Sunday" }
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

    constructor(private fb: FormBuilder, private modalService: NgbModal) {
        this.invoiceForm = fb.group({
            beforeOn: [false],
            beforeRemind: [0],
            onDueDateOn: [false],
            afterDueDateOn: [false],
            afterRemindFrequency: [null],
            afterRemindValue: [null]
        });
    }

    ngOnInit() {}

    /**
     * Table Event
     */

    selectData(index) {
        console.log(index);
    }

    /**
     * Internal Function
     */
    onChangeFrequency() {
        this.invoiceForm.controls.afterRemindFrequency
            ? this.invoiceForm.controls.afterRemindValue.setValue(1)
            : this.invoiceForm.controls.afterRemindValue.setValue(null);
    }

    editEmailTemplate(duration) {
        const modalRef = this.modalService.open(EmailTemplateModalContent, {
            size: "lg"
        });
        modalRef.componentInstance.duration = duration;
        modalRef.result.then(res => {}, dismiss => {});
    }

    onSave() {
        console.log(this.invoiceForm.value);
    }
}
