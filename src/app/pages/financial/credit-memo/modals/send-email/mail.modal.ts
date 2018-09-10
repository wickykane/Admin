import { Component, Input, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CreditMemoService } from './../../credit-memo.service';

@Component({
    selector: 'app-mail-modal',
    templateUrl: './mail.modal.html',
    styleUrls: ['./modal.scss'],
    providers: [CreditMemoService]
})
export class CreditMailModalComponent implements OnInit {
    // Resolve Data
    public mailForm: FormGroup;
    @Input() creditId;

    constructor(public activeModal: NgbActiveModal, public toastr: ToastrService, private fb: FormBuilder, private creditMemoService: CreditMemoService) {
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
        this.creditMemoService.sendMail(this.creditId, params).subscribe(res => {
            this.toastr.success(res.message);
            this.activeModal.close(this.mailForm.value);
        });
    }

    cancel() {
        this.activeModal.dismiss();
    }
}
