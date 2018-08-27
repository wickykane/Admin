import { Component, Input, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-items-order-modal-content',
    templateUrl: './items-order.modal.html',
    styleUrls: ['./items-order.modal.scss']
})
// tslint:disable-next-line:component-class-suffix
export class ItemsOrderDebitModalContent implements OnInit {


    constructor(public activeModal: NgbActiveModal,
            private toastr: ToastrService) {}

    ngOnInit() {}
}
