import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TableService } from './../../../../services/table.service';

import { environment } from '../../../../environments/environment';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { routerTransition } from '../../../../router.animations';

import { PaymentMethodsService } from '../payment-method.service';

@Component({
    selector: 'app-payment-method-create',
    templateUrl: './payment-method-create.component.html',
    styleUrls: ['./payment-method-create.component.scss'],
    animations: [routerTransition()],
    providers: [PaymentMethodsService]
})
export class PaymentMethodsCreateComponent implements OnInit {
    /**
     * letiable Declaration
     */
    public listMaster = {
        paymentTypes: [],
        status: [
            {
                key: null,
                name: '--Select--'
            },
            {
                key: 0,
                name: 'Inactive'
            },
            {
                key: 1,
                name: 'Active'
            }
        ]
    };

    constructor(
        public router: Router,
        public fb: FormBuilder,
        public toastr: ToastrService,
        public paymentMethodService: PaymentMethodsService
    ) {
    }

    ngOnInit() {
        this.getPaymentTypes();
    }
    /**
     * Internal Function
     */

    getPaymentTypes() {
        this.paymentMethodService.getPaymentTypes().subscribe(
          res => {
            try {
                this.listMaster.paymentTypes = res.data;
            } catch (err) {
                console.log(err);
            }
          },
          err => {
              console.log(err);
          }
        );
    }
}
