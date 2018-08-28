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
    selector: 'app-flat-rate-options-modal',
    templateUrl: './flat-rate-options.modal.html'
})
export class FlatRateOptionsModalComponent implements OnInit, OnDestroy {

    generalForm: FormGroup;
    @Input() typeList;
    @Input() typeFreeList;
    @Input() flatRateList;
    hotkeyCtrlLeft: Hotkey | Hotkey[];
    hotkeyCtrlRight: Hotkey | Hotkey[];
    handlingFeeTooltipText=''; 
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
            "name": ['',Validators.required],
            "type": [''],
            "shipping_fee": ['',Validators.required],
            "fee_type": [''],
            "handling_fee": [''],
            "id": "2"
        });



    }

    ngOnInit() {
        if(this.flatRateList){
            this.generalForm.patchValue(this.flatRateList);
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
    checkTooltip(id){
        console.log(id);
        console.log(this.generalForm.value.fee_Type);
                // if(this.generalForm.value.fee_Type){
            
        // }
        if(id==1){
            this.handlingFeeTooltipText = "A flat handling fee of $x will be charged in the order";
        }
        else{
            this.handlingFeeTooltipText = "Percentage of the total shipping fee of the order.";
        }

    }


}
