import { Component, Input, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { FinancialService } from './../../financial.service';

@Component({
    selector: 'app-mail-modal',
    templateUrl: './mail.modal.html',
    styleUrls: ['./modal.scss'],
    providers: [FinancialService]
})
export class ReceiptMailModalComponent implements OnInit {
    // Resolve Data
    public mailForm: FormGroup;
    @Input() invoiceId;

    constructor(public activeModal: NgbActiveModal, public toastr: ToastrService, private fb: FormBuilder, private financialService: FinancialService) {
        this.mailForm = fb.group({
            'send_to': [null, Validators.required],
            'subject': [null],
            'content': [null],
        });
    }

    ngOnInit() {
    }

    ok() {
        const params = this.mailForm.value;
        this.financialService.sendMail(this.invoiceId, params).subscribe(res => {
            this.toastr.success(res.message);
            this.activeModal.close(this.mailForm.value);
        });
    }

    cancel() {
        this.activeModal.dismiss();
    }
}
