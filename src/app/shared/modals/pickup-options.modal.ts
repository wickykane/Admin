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
    private _weekDaysList: any;
    public _wareHouseList: any;
    @Input('wareHouseList') set wareHouseList(value: any) {
        this._wareHouseList = value;
    }
    @Input('weekDaysList') set weekDaysList(value: any) {
        this._weekDaysList = value;
    }
    @Input() dayHoursList;
    @Input() pickupList;
    @Input() isView;
    hotkeyCtrlLeft: Hotkey | Hotkey[];
    hotkeyCtrlRight: Hotkey | Hotkey[];
    ranges: any = [];
    isSave = false;
    timeList: any;
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
            this._weekDaysList.forEach(item => {
                item['data'] = JSON.parse(JSON.stringify([{ from: '', to: '' }]));
                item['selected'] = JSON.parse(JSON.stringify(false));
            });


            var weekDaysList = JSON.parse(JSON.stringify(this._weekDaysList));
            this._wareHouseList.forEach(item => {
                item['bussiness_hours'] = JSON.parse(JSON.stringify(weekDaysList));
            });
            if (Array.isArray(this.pickupList['warehouse'])) {
                this.patchHours();
                this.setWareHouseTimer(this.pickupList.warehouse[0].id);
                this.generalForm.controls.warehouse.patchValue(this.pickupList.warehouse[0].id);

            }
            else {
                this.setWareHouseTimer(this.generalForm.value.warehouse);
            }

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
        var params = Object.assign({}, this.generalForm.value);

        params['warehouse'] = this.removeItem();
        this.itemService.checkCondition(params).subscribe(res => {
            this.activeModal.close({ id: '4', data: params });
        });
    }

    removeHoursItem(index, item) {
        item.splice(index, 1);
    }
    setWareHouseTimer(id) {
        this._wareHouseList.forEach(item => {
            if (item.id == id) {
                this.timeList = item;
            }
        });
        // this.timeList = item.data;
    }
    checkValue(isCheck, item) {
        return item.selected = isCheck;
    }
    trackByFn(index, item) {
        return index; // or item.id
    }
    removeItem() {
        var warehouse = JSON.parse(JSON.stringify(this._wareHouseList));
        var tempWarehouse = JSON.parse(JSON.stringify(warehouse));
        for (var i = 0; i < warehouse.length; i++) {
            tempWarehouse[i].bussiness_hours = [];
            for (var j = 0; j < warehouse[i].bussiness_hours.length; j++) {
                var bussiness_hours = warehouse[i].bussiness_hours[j];
                if (bussiness_hours.selected == true) {
                    tempWarehouse[i].bussiness_hours.push(bussiness_hours);
                }
            }
            if (tempWarehouse[i].bussiness_hours.length == 0) {
                delete tempWarehouse[i].bussiness_hours;
            }
        }
        return tempWarehouse;
    }
    patchHours() {
        var warehouse = JSON.parse(JSON.stringify(this._wareHouseList));
        var tempWarehouse = JSON.parse(JSON.stringify(warehouse));
        for (var n = 0; n < this.pickupList.warehouse.length; n++) {
            if (this.pickupList.warehouse[n].bussiness_hours) {
                for (var k = 0; k < this.pickupList.warehouse[n].bussiness_hours.length; k++) {
                    for (var i = 0; i < this._wareHouseList.length; i++) {
                        for (var j = 0; j < this._wareHouseList[i].bussiness_hours.length; j++) {
                            if (this.pickupList.warehouse[n].id == this._wareHouseList[i].id) {
                                if (this.pickupList.warehouse[n].bussiness_hours[k].id == this._wareHouseList[i].bussiness_hours[j].id) {
                                    this._wareHouseList[i].bussiness_hours[j] = JSON.parse(JSON.stringify(this.pickupList.warehouse[n].bussiness_hours[k]));
                                }

                            }
                        }
                    }
                }
            }
            else {
                this.pickupList.warehouse[n].bussiness_hours = JSON.parse(JSON.stringify(this._weekDaysList));
            }
        }
        return tempWarehouse;
    }
}
