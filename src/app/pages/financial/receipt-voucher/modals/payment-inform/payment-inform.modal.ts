import { Component, Input, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ReceiptVoucherService } from './../../receipt-voucher.service';

@Component({
    selector: 'app-payment-inform-modal',
    templateUrl: './payment-inform.modal.html',
    styleUrls: ['../modal.scss'],
    providers: [ReceiptVoucherService]
})
export class PaymentInformModalComponent implements OnInit {
    // Resolve Data
    public generalForm: FormGroup;
    @Input() type;
    public modalTitle;

    constructor(public activeModal: NgbActiveModal, public toastr: ToastrService, private fb: FormBuilder, private receiptVoucherService: ReceiptVoucherService) {
        this.generalForm = fb.group({
            'billing_id': [null, Validators.required],
            'card_number': [null, Validators.required],
            'expiration_year': [null, Validators.required],
            'expiration_month': [null, Validators.required],
            'card_holder_name': [null, Validators.required],
            'cvv': [null, Validators.required],
            'requestor': [null],
            'current_date': [null],
            'company_id': [null],
            'company_name': [null],
            // 'country_code': [null, Validators.required],
            // 'addr_line': [null, Validators.required],
            // 'city': [null, Validators.required],
            // 'state_id': [null, Validators.required],
            // 'zip_code': [null, Validators.required],
            'total_amount': null,
        });
    }

    ngOnInit() {
        this.modalTitle = (this.type) ? 'Payment Successful!' : 'Payment Failed';
    }

    ok() {
        const params = this.generalForm.value;
        // this.financialService.sendMail(this.invoiceId, params).subscribe(res => {
        //     this.toastr.success(res.message);
        //     this.activeModal.close(this.generalForm.value);
        // });
    }

    cancel() {
        this.activeModal.dismiss();
    }
}
