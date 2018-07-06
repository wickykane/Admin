import { Component, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { routerTransition } from '../../../router.animations';
import { PaymentTermService } from './payterm.service';

@Component({
    selector: 'app-payterm-create',
    templateUrl: './payterm-create.component.html',
    providers: [PaymentTermService],
    styleUrls: ['./payterm.component.scss'],
    animations: [routerTransition()]
})
export class PayTermCreateComponent implements OnInit {

    generalForm: FormGroup;
    constructor(public router: Router,
        public fb: FormBuilder,
        public toastr: ToastrService,
        private paytermService: PaymentTermService) {
    }

    ngOnInit() {}
}
