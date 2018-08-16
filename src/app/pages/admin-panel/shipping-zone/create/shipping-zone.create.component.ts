import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ToastrService } from 'ngx-toastr';
import { ShippingZoneService } from '../shipping-zone.service';
import { RMACreateKeyService } from './keys.control';

import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { routerTransition } from '../../../../router.animations';
import { CommonService } from './../../../../services/common.service';

import * as moment from 'moment';
import { StateFilterModalComponent } from '../../../../shared/modals/stateFilter.modal';
import { UPSConfigurationModalComponent} from '../../../../shared/modals/ups-configuration.modal';
import { FreeShippingOptionsModalComponent } from '../../../../shared/modals/free-shipping-options.modal';
import { FlatRateOptionsModalComponent } from '../../../../shared/modals/flat-rate-options.modal';
import { CustomRateOptionsModalComponent } from '../../../../shared/modals/custom-rate-options.modal';
import { PickupOptionsModalComponent } from '../../../../shared/modals/pickup-options.modal';
@Component({
    selector: 'app-create-shipping-zone',
    templateUrl: './shipping-zone.create.component.html',
    styleUrls: ['../shipping-zone.component.scss'],
    animations: [routerTransition()],
    providers: [DatePipe, RMACreateKeyService, CommonService]
})

export class ShippingZoneCreateComponent implements OnInit {
    /**
     * Variable Declaration
     */
    public generalForm: FormGroup;
    public listMaster = {};
    public listShipping = [];
    public listCountry = [];
    public tempListCountry = [];
    public listMasterData = {};
    public countryFilter = '';
    public listSelectCountry = [];
    public freeShippingList ={
        'free_shipping_item': 0,
        'limit_order_over': 0,
        'condition': '',
        'limit_total_weight':0,
        'id':1,
        'price':''
    };
    public flatRateList = {
            "name": '',
            "type": '',
            "shipping_fee": '',
            "fee_type": '',
            "handling_fee": '',
            "id": "2"
    };
    public customRateList = {
        "name": '',
        "type": '',
        "shipping_fee": '',
        "fee_type": '',
        "handling_fee": '',
        "id": "3",
        "charge_shipping":"",
        "ranges":[{'lbs_from':'0','lbs_to':'0','shipping_fee':'0'}]
};
public pickupList = {
    "name": '',
    "handling_fee": '',
    "id": "4",
    'pickup':'',
};
    public pickupStoreList =[];
    constructor(
        public keyService: RMACreateKeyService,
        private vRef: ViewContainerRef,
        private fb: FormBuilder,
        public toastr: ToastrService,
        private router: Router,
        private route: ActivatedRoute,
        private modalService: NgbModal,
        private shippingZoneService: ShippingZoneService,
        private commonService: CommonService,
        private dt: DatePipe) {
        this.generalForm = fb.group({
            'buyer': [null, Validators.required],
            'rma_number': [null, Validators.required],
            'rma_type': [1, Validators.required],
            'request_date': [moment().format('YYYY-MM-DD'), Validators.required],
            'order_id': [null, Validators.required],
            'return_via': [null, Validators.required],
            'carrier': [null, Validators.required],
            'cover_ship': ['Yes', Validators.required],
            'apply_restock': [0],
            'refund_method': [null, Validators.required],
            'payment_term': [null],
            'approver': [null, Validators.required],
            'address_id': [null],
            'note': [null],
            'contact_name': [null],
            'email': [null],
            'phone': [null],
            // Extra data
            'return_time': [null],
            'receiving_date': [null],
            'warehouse': [null],
            'warehouseName': [null],
            'status': [null],
            'rma_items': this.fb.array([]),
            'total_amount': [null],
            'ship_fee': [null],
            'discount': [null],
            'tax': [null],
            'restocking_fee_percent': [null],
            'restocking_fee': [null],
            'sub_total': [null],
            'return_time_name': [null]

        });

        //  Init Key
        this.keyService.watchContext.next(this);
    }

    ngOnInit() {
        this.getListMasterData();
    }
    getListMasterData() {
        this.shippingZoneService.getMasterData().subscribe(res => {
            this.listMasterData = res.data;
            this.listCountry = res.data['country'];
            this.tempListCountry = this.listCountry.slice(0);
            this.unSelectCountry();
            this.listShipping = res.data["shipping_quotes_type"];
        })
    }
    filterCountry(key) {
        console.log(key);
        this.listCountry = this.filterbyfieldName(this.tempListCountry, 'name', key);
    }
    filterbyfieldName(arr: any[], fieldname: string, value: any): any[] {
        var isSearch = (data: any): boolean => {
            var isAll = false;
            if (typeof data === 'object' && typeof data[fieldname] !== 'undefined') {
                isAll = isSearch(data[fieldname]);
            } else {
                if (typeof value === 'number') {
                    isAll = data === value;
                } else {
                    isAll = data.toString().match(new RegExp(value, 'i'));
                }
            }
            return isAll;
        };
        return arr.filter(isSearch);
    }
    selectCountry(isSelect, item) {
        console.log(isSelect, item);
        if (isSelect) {
            this.listSelectCountry.push(item);
        }
        else {
            this.listSelectCountry.forEach((res, index) => {

                if (res.country_id == item.country_id) {
                    this.listSelectCountry.splice(index, 1);
                }
            });
        }
    }
    unSelectCountry() {
        this.listCountry.forEach(item => {
            return item.selected = false;
        });
    }
    openState(code) {
        const modalRef = this.modalService.open(StateFilterModalComponent);

        modalRef.componentInstance.isEdit = false;
        modalRef.componentInstance.stateList = this.listMasterData['state'][code];
        modalRef.componentInstance.code= code;
        modalRef.result.then(res => {
            if(res['code']){
                this.listSelectCountry.forEach(item=>{
                    if(item.country_code == res.code){
                        item['state']=res.state;
                    }
                })
            }


        });

    }

    openShippingModal(id) {
        var modalRef: any;
        if (id == "1") {
            modalRef = this.modalService.open(FreeShippingOptionsModalComponent, { size: 'lg' });
            modalRef.componentInstance.condition = this.listMasterData['condition'];
            modalRef.componentInstance.id = id;
            modalRef.componentInstance.shippingList =this.freeShippingList;
        }
        if (id == "2") {
            modalRef = this.modalService.open(FlatRateOptionsModalComponent, { size: 'lg' });
            modalRef.componentInstance.typeList = this.listMasterData['type'];
            modalRef.componentInstance.typeFreeList = this.listMasterData['type_free'];
            modalRef.componentInstance.id = id;
            modalRef.componentInstance.flatRateList =this.flatRateList;
        }
        if (id == "3") {
            modalRef = this.modalService.open(CustomRateOptionsModalComponent, { size: 'lg' });
            modalRef.componentInstance.typeList = this.listMasterData['type'];
            modalRef.componentInstance.typeFreeList = this.listMasterData['type_free'];
            modalRef.componentInstance.id = id;
            modalRef.componentInstance.customRateList =this.customRateList;
        }
        if (id == "4") {
            modalRef = this.modalService.open(PickupOptionsModalComponent, { size: 'lg' });
            modalRef.componentInstance.wareHouseList = this.listMasterData['warehouse'];
            modalRef.componentInstance.weekDaysList = this.listMasterData['day_of_week'];
            modalRef.componentInstance.dayHoursList = this.listMasterData['hours_of_day'];
            modalRef.componentInstance.id = id;
            modalRef.componentInstance.pickupList =this.pickupList;
        }
        if (id == "5") {
            modalRef = this.modalService.open(UPSConfigurationModalComponent);
            modalRef.componentInstance.wareHouseList = this.listMasterData['warehouse'];
            modalRef.componentInstance.weekDaysList = this.listMasterData['day_of_week'];
            modalRef.componentInstance.dayHoursList = this.listMasterData['hours_of_day'];
            modalRef.componentInstance.id = id;
            modalRef.componentInstance.pickupList =this.pickupList;
        }
        modalRef.componentInstance.isEdit = false;
        modalRef.result.then(res => {
            console.log(res);
            if(res['id']){
                if(res['id']=='1'){
                    this.freeShippingList = res['data'];
                }
                if(res['id']=='2'){
                    this.flatRateList = res['data'];
                }
                if(res['id']=='3'){
                    this.customRateList = res['data'];
                }
            }

        });
    }






}

