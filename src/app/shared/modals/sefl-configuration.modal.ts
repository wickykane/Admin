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

@Component({
    selector: 'app-sefl-options-modal',
    templateUrl: './sefl-configuration.modal.html'
})
export class SEFLConfigurationModalComponent implements OnInit, OnDestroy {

    generalForm: FormGroup;
    @Input() pickupList;
    @Input() typeFreeList;
    @Input() upsList;
    @Input() seflModalList;
    @Input() isView;
    hotkeyCtrlLeft: Hotkey | Hotkey[];
    hotkeyCtrlRight: Hotkey | Hotkey[];
    ranges: any = [];
    isSave = false;
    typeList: any = [];
    constructor(public fb: FormBuilder,
        public router: Router,
        public toastr: ToastrService,
        private itemService: ItemService,
        private modalService: NgbModal,
        private hotkeysService: HotkeysService,
        private commonService: CommonService,
        public activeModal: NgbActiveModal) {

        this.generalForm = fb.group({
            "account": ['', Validators.required],
            "username": ['', Validators.required],
            "password": ['', Validators.required],
            "markup_type_value": [''],
            "markup_type": [''],
            "fee_type": [''],
            "handling_fee": [''],
            'id': '6'
            // 'ranges':[this.fb.array([])]
        });



    }

    ngOnInit() {
        this.typeList = this.typeFreeList.slice(0);
        if (this.seflModalList) {
            this.generalForm.patchValue(this.seflModalList);
        }
        if (this.isView) {
            this.generalForm.disable();
        }
        else {
            this.isView = false;
        }
    }

    ngOnDestroy() {
        this.hotkeysService.remove(this.hotkeyCtrlLeft);
        this.hotkeysService.remove(this.hotkeyCtrlRight);
    }
    addNewHours(item) {
        item.push({ from: '', to: '' });
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
        if (this.generalForm.invalid) {
            for (let inner in this.generalForm.controls) {
                this.generalForm.get(inner).markAsTouched();
                // this.generalForm.get(inner).updateValueAndValidity();
            }
            console.log(this.generalForm);
            return false;
        }
        var params = Object.assign({}, this.generalForm.value);
        // params['ranges']=this.ranges;
        this.itemService.checkCondition(params).subscribe(res => {
            console.log(res);
            this.activeModal.close({ id: '6', data: params });
        });
        // }
        // else{
        //     return;
        // }

    }

    removeHoursItem(index, item) {
        item.splice(index, 1);
    }
    testConnection() {
        var params = {
            "account": this.generalForm.value.account,
            "username": this.generalForm.value.username,
            "password": this.generalForm.value.password,
        };
        if (this.generalForm.invalid) {
            for (let inner in this.generalForm.controls) {
                this.generalForm.get(inner).markAsTouched();
                // this.generalForm.get(inner).updateValueAndValidity();
            }
            console.log(this.generalForm);
            return false;
        }
        this.itemService.checkSEFLConnection(params).subscribe(res => {
            console.log(res);
            this.toastr.success(res.message);
        }, error => {
            console.log(error);
        });
    }
    calculateUPSLength() {
        var count = 0;
        this.upsList.forEach(res => {
            if (res.selected) {
                count++;
            }
        });
        return count;
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
