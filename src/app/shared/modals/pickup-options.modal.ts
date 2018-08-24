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
    selector: 'app-pickup-options-modal',
    templateUrl: './pickup-options.modal.html'
})
export class PickupOptionsModalComponent implements OnInit, OnDestroy {

    generalForm: FormGroup;
    private _weekDaysList:any;
    private _wareHouseList:any;
    @Input('wareHouseList') set wareHouseList(value: any) {
        this._wareHouseList = value;
    }
    @Input('weekDaysList') set weekDaysList(value: any) {
        this._weekDaysList = value;
    }
    @Input() dayHoursList;
    @Input() pickupList;
    hotkeyCtrlLeft: Hotkey | Hotkey[];
    hotkeyCtrlRight: Hotkey | Hotkey[];
    ranges: any = [];
    isSave =false;
    timeList:any;
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
            "warehouse": [''],
            "handling_fee": [''],
            "id": "4",
            // 'ranges':[this.fb.array([])]
        });



    }

    ngOnInit() {
        if (this.pickupList) {
            this.generalForm.patchValue(this.pickupList);
            this.ranges = this.pickupList.ranges;
            if(this.pickupList['bussiness_hours']){
                this.weekDaysList = this.pickupList['bussiness_hours'];
            }
            else{
                this._weekDaysList.forEach(item=>{
                    item['data']=[{from:'',to:''}];
                    item['selected']= false;
                })
            }
            var weekDaysList = Object.assign([],this._weekDaysList);
            this._wareHouseList.map(item=>{
                item['bussiness_hours']= weekDaysList;
            });
            this.setWareHouseTimer(this.generalForm.value.warehouse);
        }


    }

    ngOnDestroy() {
        this.hotkeysService.remove(this.hotkeyCtrlLeft);
        this.hotkeysService.remove(this.hotkeyCtrlRight);
    }
    addNewHours(item){
        item.push({from:'',to:''});
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
        console.log(this.weekDaysList);
        var params = Object.assign({},this.generalForm.value);
        // var weekDaysList1 = this._wareHouseList.slice(0);
        // console.log(weekDaysList1);
        // weekDaysList1.forEach((item,index,object)=>{
        //     console.log(item);
        //     if(item.selected == false){
        //         object.splice(index,1);
        //     }
        // });
        // params['bussiness_hours']=weekDaysList1;
        params['warehouse'] = this._wareHouseList;
        this.itemService.checkCondition(params).subscribe(res => {
            console.log(res);
            this.activeModal.close({ id: '4', data: params });
        });
        }

    removeHoursItem(index,item) {
        item.splice(index, 1);
    }
    setWareHouseTimer(id){
        this._wareHouseList.forEach(item=>{
            if(item.id ==id){
                this.timeList = item;
            }
        });
        // this.timeList = item.data;
    }
    checkValue(isCheck,item){
        return item.selected = isCheck;
    }
    trackByFn(index, item) {
        return index; // or item.id
    }
}
