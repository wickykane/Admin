import { state } from '@angular/animations';
import { Component, Input, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TableService } from './../../services/table.service';


import { ItemService } from './item.service';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../services/common.service';
import { ShippingZoneModalKeyService } from './keys.control';
@Component({
    selector: 'app-free-shipping-options-modal',
    templateUrl: './free-shipping-options.modal.html',
    providers: [ShippingZoneModalKeyService],
})
export class FreeShippingOptionsModalComponent implements OnInit, OnDestroy {

    generalForm: FormGroup;
    @Input() condition;
    @Input() id;
    @Input() shippingList;
    @Input() isView;
    hotkeyCtrlLeft: Hotkey | Hotkey[];
    hotkeyCtrlRight: Hotkey | Hotkey[];

    constructor(public fb: FormBuilder,
        public router: Router,
        public toastr: ToastrService,
        private itemService: ItemService,
        private modalService: NgbModal,
        private hotkeysService: HotkeysService,
        private commonService: CommonService,
        public activeModal: NgbActiveModal,
        public keyService: ShippingZoneModalKeyService) {

        this.generalForm = fb.group({
            'free_shipping_item': [0],
            'limit_order_over': [0],
            'condition': [''],
            'limit_total_weight': [0],
            'id': [1],
            'price': [],
            'lbs_from': [],
            'lbs_to': [null]
        });
        this.keyService.watchContext.next({ context: this, service: this.hotkeysService });


    }

    ngOnInit() {
        if (this.shippingList) {
            this.generalForm.patchValue(this.shippingList);
        }
        if (this.isView) {
            this.generalForm.disable();
        } else {
            this.isView = false;
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
    applyData() {
        console.log(this.generalForm.value);
        this.itemService.checkCondition(this.generalForm.value).subscribe(res => {
            console.log(res);
            this.activeModal.close({ id: '1', data: this.generalForm.value });
        });
    }

    checkCondition() {
        console.log(this.generalForm.value.condition);
        if (this.generalForm.value.condition !== '') {
            this.generalForm.patchValue({ 'limit_total_weight': true, 'limit_order_over': true });
        }
    }
    upToValue() {
        if (!this.isView) {
            this.generalForm.patchValue({ 'lbs_to': '' });
        }

    }
    checkPositiveNumber(e) {
        const pattern = /[0-9.]/;
        const inputChar = String.fromCharCode(e.charCode);

        if (!pattern.test(inputChar)) {
            // invalid character, prevent input
            event.preventDefault();
        }
    }
}
