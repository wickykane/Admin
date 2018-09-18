import { Component, Input, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from './../../../../../services/common.service';
import { ReceiptVoucherService } from './../../receipt-voucher.service';

@Component({
    selector: 'app-payment-gateway-modal',
    templateUrl: './payment-gateway.modal.html',
    styleUrls: ['../modal.scss'],
    providers: [ReceiptVoucherService, CommonService]
})
export class PaymentGatewayModalComponent implements OnInit {
    // Resolve Data
    public generalForm: FormGroup;
    public listMaster = {};
    @Input() data;
    public modalTitle;

    constructor(public activeModal: NgbActiveModal, public toastr: ToastrService, private fb: FormBuilder, private receiptVoucherService: ReceiptVoucherService, private commonService: CommonService) {
        this.generalForm = fb.group({
            'bill_to': [null, Validators.required],
            'card_no': [null, Validators.required],
            'expiration_year': [null, Validators.required],
            'expiration_month': [null, Validators.required],
            'card_name': [null, Validators.required],
            'cvv': [null, Validators.required],
            'requestor': [null],
            'current_date': [null],
            'company_id': [null],
            'company_name': [null],
            'country_code': [null, Validators.required],
            'addr_line': [null, Validators.required],
            'city': [null, Validators.required],
            'state_id': [null, Validators.required],
            'zip_code': [null, Validators.required],
        });
    }

    ngOnInit() {
        this.listMaster['months'] = Array.from(Array(12).keys()).map(i => i + 1);
        this.listMaster['years'] = Array.from(Array(new Date().getFullYear() + 20).keys()).map(i => i + 1).filter(i => i >= new Date().getFullYear());
        const user = this.data.user;
        const payer = this.data.payer;

        this.generalForm.patchValue({
            company_name: user.full_name,
            company_id: user.id,
            requestor: payer.company_name,
            current_date: moment().format('MM/DD/YYYY hh:mm'),
        });

    }

    changeAddress() {
        this.data['billing'] = (this.data['payer'].billing || []).find(item => +item.address_id === +this.generalForm.value.bill_to) || {};
    }

    getListCountry() {
        this.commonService.getListCountry().subscribe(res => {
            try {
                this.listMaster['countries'] = res.data;
            } catch (e) {
                console.log(e);
            }
        });
    }

    getStateByCountry(params) {
        this.commonService.getStateByCountry(params).subscribe(res => {
            try {
                this.listMaster['state'] = res.data;
            } catch (e) {
                console.log(e);
            }
        });
    }

    changeCountry() {
        const id = this.generalForm.value.country_code;
        const params = {
            country: id
        };
        this.getStateByCountry(params);
    }
    ok() {
        const params = this.generalForm.value;
        // this.receiptVoucherService.sendMail(this.invoiceId, params).subscribe(res => {
        //     this.toastr.success(res.message);
        //     this.activeModal.close(this.generalForm.value);
        // });
    }

    cancel() {
        this.activeModal.dismiss();
    }
}
