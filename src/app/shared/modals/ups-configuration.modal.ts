import { state } from '@angular/animations';
import { Component, Input, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TableService } from './../../services/table.service';

import { CustomerService } from '../../pages/customer-mgmt/customer.service';
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
    hotkeyCtrlLeft: Hotkey | Hotkey[];
    hotkeyCtrlRight: Hotkey | Hotkey[];
    ranges: any = [];
    isSave = false;
    typeList: any = [];
    constructor(public fb: FormBuilder,
        public router: Router,
        public toastr: ToastrService,
        private itemService: ItemService,
        private customerService: CustomerService,
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
            "handling_fee": ['']
            // 'ranges':[this.fb.array([])]
        });



    }

    ngOnInit() {
        this.typeList = this.typeFreeList.slice(0);
        if (this.pickupList) {
            this.generalForm.patchValue(this.pickupList);
            this.ranges = this.pickupList.ranges;
        }
        this.checkAllUPS(true);
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
        // this.checkRanges();
        // console.log(this.isSave);
        // if(this.isSave==true){
        // var params = Object.assign({},this.generalForm.value);
        // params['ranges']=this.ranges;
        // this.itemService.checkCondition(params).subscribe(res => {
        //     console.log(res);
        //     this.activeModal.close({ id: '3', data: params });
        // });
        // }
        // else{
        //     return;
        // }

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
            console.log(this.generalForm);
            return false;
        }
        this.itemService.checkConnection(params).subscribe(res => {
            console.log(res);
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
    checkAllUPS(isTrue){
        this.upsList.forEach(item=>{
            item.selected = isTrue;
        })
    }
}
