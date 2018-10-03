import { Component, Input, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { FinancialService } from './../../../financial.service';

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
            'delivery_date': [null, Validators.required],
        });
    }

    ngOnInit() {
    }

    ok() {
        this.financialService.updatePOD(this.invoiceId, this.generalForm.value).subscribe(res => {
            this.toastr.success(res.message);
            this.activeModal.close(true);
        });
    }

    cancel() {
        this.activeModal.dismiss();
    }
}
