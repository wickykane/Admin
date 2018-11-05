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
    selector: 'app-flat-rate-options-modal',
    templateUrl: './flat-rate-options.modal.html',
    providers: [ShippingZoneModalKeyService],
})
export class FlatRateOptionsModalComponent implements OnInit, OnDestroy {

    generalForm: FormGroup;
    @Input() typeList;
    @Input() typeFreeList;
    @Input() flatRateList;
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
            'name': ['', Validators.required],
            'type': [''],
            'shipping_fee': ['', Validators.required],
            'fee_type': [''],
            'handling_fee': [''],
            'id': '2'
        });

        this.keyService.watchContext.next({ context: this, service: this.hotkeysService });

    }

    ngOnInit() {
        if (this.flatRateList) {
            this.generalForm.patchValue(this.flatRateList);
        }
        if (this.isView) {
            this.generalForm.disable();
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
        // console.log(this.generalForm);
        this.itemService.checkCondition(this.generalForm.value).subscribe(res => {
            console.log(res);
            this.activeModal.close({ id: '2', data: this.generalForm.value });
        });
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
