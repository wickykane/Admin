import { Component, Input, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ReceiptVoucherService } from './../../receipt-voucher.service';

@Component({
    selector: 'app-payment-gateway-modal',
    templateUrl: './payment-gateway.modal.html',
    styleUrls: ['../modal.scss'],
    providers: [ReceiptVoucherService]
})
export class PaymentGatewayModalComponent implements OnInit {
    // Resolve Data
    public mailForm: FormGroup;
    @Input() receiptId;
    public modalTitle;

    constructor(public activeModal: NgbActiveModal, public toastr: ToastrService, private fb: FormBuilder, private receiptVoucherService: ReceiptVoucherService) {
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
        // this.receiptVoucherService.sendMail(this.invoiceId, params).subscribe(res => {
        //     this.toastr.success(res.message);
        //     this.activeModal.close(this.mailForm.value);
        // });
    }

    cancel() {
        this.activeModal.dismiss();
    }
}
