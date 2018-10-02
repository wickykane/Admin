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
    @Input() data;
    public modalTitle;

    constructor(public activeModal: NgbActiveModal, public toastr: ToastrService, private fb: FormBuilder, private receiptVoucherService: ReceiptVoucherService) {
        this.generalForm = fb.group({
            'billing_id': [null],
            'card_number': [null],
            'card_holder_name': [null],
            'current_date': [null],
            'total_amount': null,
            'address': null,
            'error': null,
            'auth_code': null,
            'trans_id': null,
            'receipt_dt': null,
        });
    }

    ngOnInit() {
        this.modalTitle = (this.type) ? 'Payment Successful!' : 'Payment Failed!';
        const address = [this.data.address_line, this.data.city_name, this.data.state_name, this.data.zip_code, this.data.country_name].join(' ');
        let cardNumber = this.data.card_number;
        cardNumber = 'xxxx-' + cardNumber.substr(cardNumber.length - 4, cardNumber.length);
        const respone = this.data.respone.data || {};
        this.generalForm.patchValue({ ...this.data, address, receipt_dt: this.data.current_date, error: this.data.respone.message, card_number: cardNumber, auth_code: respone.auth_code, trans_id: respone.trans_id });
    }

    ok() {
        this.activeModal.close(0);
    }

    retry() {
        this.activeModal.close(this.generalForm.value);
    }

    cancel() {
        this.activeModal.dismiss();
    }
}
