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
    selector: 'app-custom-rate-options-modal',
    templateUrl: './custom-rate-options.modal.html'
})
export class CustomRateOptionsModalComponent implements OnInit, OnDestroy {

    generalForm: FormGroup;
    @Input() typeList;
    @Input() typeFreeList;
    @Input() customRateList;
    hotkeyCtrlLeft: Hotkey | Hotkey[];
    hotkeyCtrlRight: Hotkey | Hotkey[];
    ranges: any = [];
    isSave =false;
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
            "name": ['', Validators.required],
            "type": [''],
            "shipping_fee": [''],
            "fee_type": [''],
            "handling_fee": [''],
            "id": "3",
            "charge_shipping": "",
            // 'ranges':[this.fb.array([])]
        });



    }

    ngOnInit() {
        if (this.customRateList) {
            this.generalForm.patchValue(this.customRateList);
            this.ranges = this.customRateList.ranges;
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
        this.checkRanges();
        console.log(this.isSave);
        if(this.isSave==true){
        var params = Object.assign({},this.generalForm.value);
        params['ranges']=this.ranges;
        this.itemService.checkCondition(params).subscribe(res => {
            console.log(res);
            this.activeModal.close({ id: '3', data: params });
        });
        }
        else{
            return;
        }

    }
    addNewRange() {
        this.ranges.push({ 'lbs_from': '0', 'lbs_to': '0', 'shipping_fee': '0' });
    }
    removeRangeItem(index) {
        this.ranges.splice(index, 1);
    }
    checkRanges() {
        //    return this.ranges.forEach(item => {
        //         if(item.lbs_to>item.lbs_from){
        //             break;
        //         }
        //     });
        for (var i = 0; i < this.ranges.length; i++) {
            if (this.ranges[i].lbs_to < this.ranges[i].lbs_from) {
                this.isSave =false;
                break;
                
            }
            else{
                this.isSave =true;
            }

        }
    }
}