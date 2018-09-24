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
    selector: 'app-ups-options-modal',
    templateUrl: './ups-configuration.modal.html'
})
export class UPSConfigurationModalComponent implements OnInit, OnDestroy {

    generalForm: FormGroup;
    @Input() pickupList;
    @Input() typeFreeList;
    @Input() upsList;
    @Input() pickupModalList;
    @Input() isView;
    @Input() customer_classificationList;
    hotkeyCtrlLeft: Hotkey | Hotkey[];
    hotkeyCtrlRight: Hotkey | Hotkey[];
    ranges: any = [];
    isSave = false;
    typeList: any = [];
    tempCustomer_classificationList: any;
    constructor(public fb: FormBuilder,
        public router: Router,
        public toastr: ToastrService,
        private itemService: ItemService,
        private modalService: NgbModal,
        private hotkeysService: HotkeysService,
        private commonService: CommonService,
        public activeModal: NgbActiveModal) {

        this.generalForm = fb.group({
            "access_key": ['', Validators.required],
            "user_id": ['', Validators.required],
            "password": ['', Validators.required],
            "rates": [false],
            "account_number": [''],
            "ups_customer": [''],
            "fee_type": [''],
            "handling_fee": [''],
            "markup_type": [''],
            "markup_type_value": [''],
            "id": "5"
            // 'ranges':[this.fb.array([])]
        });



    }

    ngOnInit() {
        this.typeList = this.typeFreeList.slice(0);
        this.tempCustomer_classificationList = JSON.parse(JSON.stringify(this.customer_classificationList));
        if (this.pickupModalList) {
            this.generalForm.patchValue(this.pickupModalList);
            if (this.pickupModalList.ship_options) {
                this.checkUPSbyForm();
            }
            else {
                this.checkAllUPS(true);
            }
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
        var count = 0;
        var params = Object.assign({}, this.generalForm.value);
        params['ship_options'] = this.getShipOptions();
        console.log(this.upsList);

        for (var i = 0; i < this.upsList.length; i++) {
            if (this.upsList[i].selected) {
                count++;
            }
        }
        if (count == 0) {
            return false;
        }
        this.itemService.checkCondition(params).subscribe(res => {
            this.activeModal.close({ id: '5', data: params });
        });

    }

    removeHoursItem(index, item) {
        item.splice(index, 1);
    }
    checkRanges() {
        //    return this.ranges.forEach(item => {
        //         if(item.lbs_to>item.lbs_from){
        //             break;
        //         }
        //     });
        for (var i = 0; i < this.ranges.length; i++) {
            if (this.ranges[i].lbs_to < this.ranges[i].lbs_from) {
                this.isSave = false;
                break;

            }
            else {
                this.isSave = true;
            }

        }
    }
    testConnection() {
        var params = {
            "access_key": this.generalForm.value.access_key,
            "user_id": this.generalForm.value.user_id,
            "password": this.generalForm.value.password,
        };
        if (this.generalForm.invalid) {
            for (let inner in this.generalForm.controls) {
                this.generalForm.get(inner).markAsTouched();
                // this.generalForm.get(inner).updateValueAndValidity();
            }
            return false;
        }
        this.itemService.checkConnection(params).subscribe(res => {
            this.toastr.success(res.message);
        }, error => {
            console.log(error);
        });
    }
    checkRates() {
        if (this.generalForm.value.rates) {
            this.generalForm.controls.account_number.setErrors(Validators.required);
            this.generalForm.controls.ups_customer.setErrors(Validators.required);
        }
        else {
            this.generalForm.controls.account_number.setErrors(null);
            this.generalForm.controls.ups_customer.setErrors(null);
        }
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
    checkUPS(item, event) {
        return item.selected = event.target.checked;
    }
    checkAllUPS(isTrue) {
        this.upsList.forEach(item => {
            item.selected = isTrue;
        })
    }
    getShipOptions() {
        var ship_options = JSON.parse(JSON.stringify(this.upsList));
        var tempShip_options = [];
        for (var i = 0; i < ship_options.length; i++) {
            if (ship_options[i].selected) {
                tempShip_options.push(ship_options[i].id);
            }
        }
        return tempShip_options;
    }
    checkUPSbyForm() {
        console.log(this.upsList);
        var ship_options = JSON.parse(JSON.stringify(this.pickupModalList.ship_options));
        console.log(ship_options);
        for (var i = 0; i < this.upsList.length; i++) {
            for (var j = 0; j < ship_options.length; j++) {
                if (this.upsList[i].id == ship_options[j]) {
                    this.upsList[i].selected = true;
                }
            }

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
