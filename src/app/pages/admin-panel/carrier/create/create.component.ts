import { Component, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { routerTransition } from '../../../../router.animations';
import { CarrierService } from '../carrier.service';

@Component({
    selector: 'app-carrier-create',
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.scss'],
    animations: [routerTransition()]
})
export class CreateComponent implements OnInit {

    generalForm: FormGroup;
    
    constructor(public router: Router,
        public fb: FormBuilder,
        public toastr: ToastrService,
        private vRef: ViewContainerRef,
        private cs: CarrierService) {
    }

    ngOnInit() {}
}
