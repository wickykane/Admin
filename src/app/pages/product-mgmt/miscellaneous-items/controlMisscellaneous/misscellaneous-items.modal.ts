import { state } from '@angular/animations';
import { Component, Input, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../../../services/common.service';

@Component({
    selector: 'misscellaneous-items-modal',
    templateUrl: './misscellaneous-items.modal.html',
    providers: [ CommonService]
})
export class MiscellaneousItemsModalComponent implements OnInit, OnDestroy {

    generalForm: FormGroup;
    @Input() condition;
    @Input() id;
    @Input() shippingList;
    hotkeyCtrlLeft: Hotkey | Hotkey[];
    hotkeyCtrlRight: Hotkey | Hotkey[];

    constructor(public fb: FormBuilder,
        public router: Router,
        public toastr: ToastrService,
        private modalService: NgbModal,
        private hotkeysService: HotkeysService,
        private commonService: CommonService,
        public activeModal: NgbActiveModal) {

        this.generalForm = fb.group({
            'free_shipping_item': [0],
            'limit_order_over': [0],
            'condition': [''],
            'limit_total_weight': [0],
            'id': [1],
            'price': [],
            'lbs_from': [],
            'lbs_to1': [null]
        });



    }

    ngOnInit() {
        if (this.shippingList) {
            this.generalForm.patchValue(this.shippingList);
        }
    }

    ngOnDestroy() {
        this.hotkeysService.remove(this.hotkeyCtrlLeft);
        this.hotkeysService.remove(this.hotkeyCtrlRight);
    }



    closeModal(data) {
        this.activeModal.close(data);
    }

    closeX() {
        const data = {};
        this.activeModal.close(data);
    }
}
