import { Component, Input, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { FinancialService } from './../../../financial.service';

import * as moment from 'moment';

@Component({
    selector: 'app-pod-modal',
    templateUrl: './pod.modal.html',
    styleUrls: ['../modal.scss'],
})
export class PODModalComponent implements OnInit {
    // Resolve Data
    public generalForm: FormGroup;
    @Input() invoiceId;
    constructor(public activeModal: NgbActiveModal, public toastr: ToastrService, private fb: FormBuilder, private financialService: FinancialService) {
        this.generalForm = fb.group({
            'date': [null, Validators.required],
        });
    }

    ngOnInit() {
    }

    ok() {
        const params = {
            date: moment(this.generalForm.value.date).format('MM/DD/YYYY'),
        };

        this.financialService.updatePOD(this.invoiceId, params).subscribe(res => {
            this.toastr.success(res.message);
            this.activeModal.close(true);
        });
    }

    cancel() {
        this.activeModal.dismiss();
    }
}
