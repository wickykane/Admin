import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { Form, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ToastrService } from 'ngx-toastr';
import { ShippingZoneService } from '../shipping-zone.service';
import { ShippingZoneCreateKeyService } from './keys.control';

import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { routerTransition } from '../../../../router.animations';
import { CommonService } from './../../../../services/common.service';

import { cdArrowTable } from '../../../../shared';

import * as moment from 'moment';
import { CustomRateOptionsModalComponent } from '../../../../shared/modals/custom-rate-options.modal';
import { FlatRateOptionsModalComponent } from '../../../../shared/modals/flat-rate-options.modal';
import { FreeShippingOptionsModalComponent } from '../../../../shared/modals/free-shipping-options.modal';
import { PickupOptionsModalComponent } from '../../../../shared/modals/pickup-options.modal';
import { SEFLConfigurationModalComponent } from '../../../../shared/modals/sefl-configuration.modal';
import { StateFilterModalComponent } from '../../../../shared/modals/stateFilter.modal';
import { UPSConfigurationModalComponent } from '../../../../shared/modals/ups-configuration.modal';
@Component({
    selector: 'app-create-shipping-zone',
    templateUrl: './shipping-zone.create.component.html',
    styleUrls: ['../shipping-zone.component.scss', './shipping-zone.create.component.scss'],
    animations: [routerTransition()],
    providers: [DatePipe, ShippingZoneCreateKeyService, CommonService],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ShippingZoneCreateComponent implements OnInit {
    /**
     * Variable Declaration
     */
    public selectAll = false;
    public generalForm: FormGroup;
    public listMaster = {};
    public listShipping = [];
    public listCountry = [];
    public tempListCountry = [];
    public tempListState = [];
    public listMasterData = {};
    public countryFilter = '';
    public stateFilter = '';
    public listSelectCountry = [];
    public selectedIndex = {
        0: 0,
        1: undefined
    };
    public data: any = {};
    public tempShippingList = [];
    public freeShippingList = {
        'free_shipping_item': 0,
        'limit_order_over': 0,
        'condition': '',
        'limit_total_weight': 0,
        'id': 1,
        'price': '0.00'
    };
    public listStatus = [{
        'id': '1',
        'name': 'Active'
    },
    {
        'id': '0',
        'name': 'Inactive'
    }];
    public flatRateList = {
        'name': '',
        'type': '1',
        'shipping_fee': '0.00',
        'fee_type': '1',
        'handling_fee': '0.00',
        'id': '2'
    };
    public customRateList = {
        'name': '',
        'type': '',
        'shipping_fee': '',
        'fee_type': '1',
        'handling_fee': '0.00',
        'id': '3',
        'charge_shipping': '1',
        'ranges': [{ 'lbs_from': '0', 'lbs_to': '20.00', 'shipping_fee': '8.00' }]
    };
    public pickupList = {
        'name': '',
        'handling_fee': '0.00',
        'id': '4',
        'warehouse': '1',
    };
    public upsList = {
        'id': '5',
        'access_key': '',
        'user_id': '',
        'password': '',
        'rates': false,
        'account_number': '',
        'ups_customer': '00',
        'fee_type': '1',
        'handling_fee': '0',
        'markup_type': '1',
        'markup_type_value': '0',
    };
    public seflList = {
        'account': '',
        'username': '',
        'password': '',
        'markup_type_value': '0.00',
        'markup_type': '1',
        'fee_type': '1',
        'handling_fee': '0.00',
        'id': '6'
    };
    public selectedCountry = null;

    public pickupStoreList = [];
    public checkTable = false;
    @ViewChild(cdArrowTable) table: cdArrowTable;
    @ViewChild('tableDiv') tableDiv: ElementRef;
    constructor(
        private cd: ChangeDetectorRef,
        public keyService: ShippingZoneCreateKeyService,
        private vRef: ViewContainerRef,
        private fb: FormBuilder,
        public toastr: ToastrService,
        private router: Router,
        private route: ActivatedRoute,
        private modalService: NgbModal,
        private shippingZoneService: ShippingZoneService,
        private commonService: CommonService,
        private _hotkeysService: HotkeysService,
        private dt: DatePipe) {
        this.generalForm = fb.group({
            'name': [''],
            'status': ['1']

        });

        //  Init Key
        this.keyService.watchContext.next({ context: this, service: this._hotkeysService });
    }

    ngOnInit() {
        this.getListMasterData();
    }
    refresh() {
        if (!this.cd['destroyed']) { this.cd.detectChanges(); }
    }
    getListMasterData() {
        this.shippingZoneService.getMasterData().subscribe(res => {
            this.listMasterData = res.data;
            this.listCountry = res.data['country'];
            this.tempListCountry = this.listCountry.slice(0);
            this.unSelectCountry();
            this.listShipping = res.data['shipping_quotes_type'];
            for (var i = 0; i < this.listShipping.length; i++) {
                for (var j = 0; j < this.listShipping[i].data.length; j++) {
                    this.listShipping[i].data[j].checked = false;
                }
            }
            this.refresh();
        });
    }
    filterCountry(key) {
        this.listCountry = this.filterbyfieldName(this.tempListCountry, 'name', key);
    }
    filterbyfieldName(arr: any[], fieldname: string, value: any): any[] {
        const isSearch = (data: any): boolean => {
            let isAll = false;
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
        item.state = this.listMasterData['state'][item.country_code];
        if (item.state) {
            item.state.forEach(res => {
                return res.selected = true;
            });
        } else {
            item.state = [];
        }
        if (isSelect) {
            this.listSelectCountry.push(item);
        } else {
            if (this.selectedCountry != null) {
                if (this.selectedCountry.country_id === item.country_id) {
                    this.selectedCountry = null;
                }
            }
            this.listSelectCountry.forEach((res, index) => {
                if (res.country_id === item.country_id) {
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

    filterState(key) {
        this.selectedCountry.state = this.filterbyfieldName(this.tempListState, 'name', key);
    }

    onCheckCountryState(country) {
        this.stateFilter = '';
        this.selectedCountry = Object.assign([], ...country);
        this.tempListState = country.state;
        this.checkState();
    }

    openShippingModal(id) {
        this.keyService.saveKeys();
        var modalRef: any;
        if (id == '1') {
            modalRef = this.modalService.open(FreeShippingOptionsModalComponent);
            modalRef.componentInstance.condition = this.listMasterData['condition'];
            modalRef.componentInstance.id = id;
            modalRef.componentInstance.shippingList = this.freeShippingList;
        }
        if (id == '2') {
            modalRef = this.modalService.open(FlatRateOptionsModalComponent);
            modalRef.componentInstance.typeList = this.listMasterData['type'];
            modalRef.componentInstance.typeFreeList = this.listMasterData['type_free'];
            modalRef.componentInstance.id = id;
            modalRef.componentInstance.flatRateList = this.flatRateList;
        }
        if (id == '3') {
            modalRef = this.modalService.open(CustomRateOptionsModalComponent, { size: 'lg' });
            modalRef.componentInstance.typeList = this.listMasterData['charge_shipping'];
            modalRef.componentInstance.typeFreeList = this.listMasterData['type_free'];
            modalRef.componentInstance.id = id;
            modalRef.componentInstance.customRateList = this.customRateList;
        }
        if (id =='4') {
            modalRef = this.modalService.open(PickupOptionsModalComponent, { size: 'lg' });
            modalRef.componentInstance.wareHouseList = this.listMasterData['warehouse'];
            modalRef.componentInstance.weekDaysList = this.listMasterData['day_of_week'];
            modalRef.componentInstance.dayHoursList = this.listMasterData['hours_of_day'];
            modalRef.componentInstance.id = id;
            modalRef.componentInstance.pickupList = this.pickupList;
        }
        if (id == '5') {
            modalRef = this.modalService.open(UPSConfigurationModalComponent);
            modalRef.componentInstance.id = id;
            modalRef.componentInstance.pickupModalList = this.upsList;
            modalRef.componentInstance.typeFreeList = this.listMasterData['type_free'];
            modalRef.componentInstance.upsList = this.listMasterData['ups'];
            modalRef.componentInstance.customer_classificationList = this.listMasterData['customer_classification'];

        }
        if (id == '6') {
            modalRef = this.modalService.open(SEFLConfigurationModalComponent);
            modalRef.componentInstance.id = id;
            modalRef.componentInstance.seflModalList = this.seflList;
            modalRef.componentInstance.typeFreeList = this.listMasterData['type_free'];
            modalRef.componentInstance.upsList = this.listMasterData['ups'];
        }
        modalRef.componentInstance.isEdit = false;
        modalRef.result.then(res => {
            if (this.keyService.keys.length > 0) {
                this.keyService.reInitKey();
                this.table.reInitKey(this.data['tableKey']);
            }
            if (res['id']) {
                if (res['id'] == '1') {
                    this.freeShippingList = res['data'];
                }
                if (res['id'] == '2') {
                    this.flatRateList = res['data'];
                }
                if (res['id'] == '3') {
                    this.customRateList = res['data'];
                }
                if (res['id'] == '4') {
                    this.pickupList = res['data'];
                }
                if (res['id'] == '5') {
                    this.upsList = res['data'];
                }
                if (res['id'] == '6') {
                    this.seflList = res['data'];
                }
            }
            this.refresh();
        }, (reason) => {
            if (this.keyService.keys.length > 0) {
                this.keyService.reInitKey();
                this.table.reInitKey(this.data['tableKey']);
            }
          });
    }
    save() {

        var listCountry = JSON.parse(JSON.stringify(this.listSelectCountry));
        for (var i = 0; i < listCountry.length; i++) {
            var listId = [];
            for (var j = 0; j < listCountry[i].state.length; j++) {
                if (listCountry[i].state[j].selected && !listCountry[i].state[j].disable) {
                    listId.push(listCountry[i].state[j].id);
                }

            }
            listCountry[i].state = listId;
            delete listCountry[i].selected;
            delete listCountry[i].index;
            delete listCountry[i].name;
            delete listCountry[i].country_id;
            listCountry[i].code = listCountry[i].country_code;
            delete listCountry[i].country_code;
        }
        var params = this.generalForm.value;
        // if()
        params['shipping_quotes'] = [];
        // params['shipping_quotes'] = [this.freeShippingList, this.flatRateList, this.customRateList, this.pickupList];
        for (var i = 0; i < this.listShipping.length; i++) {
            for (var j = 0; j < this.listShipping[i]['data'].length; j++) {
                var item = this.listShipping[i]['data'][j];
                if (item['checked'] == true) {
                    if (item['id'] == 1) {
                        params['shipping_quotes'].push(this.freeShippingList);
                    }
                    if (item['id'] == 2) {
                        params['shipping_quotes'].push(this.flatRateList);
                    }
                    if (item['id'] == 3) {
                        params['shipping_quotes'].push(this.customRateList);
                    }
                    if (item['id'] == 4) {
                        params['shipping_quotes'].push(this.pickupList);
                    }
                    if (item['id'] == 5) {
                        params['shipping_quotes'].push(this.upsList);
                    }
                    if (item['id'] == 6) {
                        params['shipping_quotes'].push(this.seflList);
                    }
                }
            }
        }

        params['country'] = listCountry;
        // var listShipping = this.listShipping.slice(0);
        // for (var i = 0; i < listShipping.length; i++) {
        //     for (var j = 0; j < listShipping[i].data.length; j++) {
        //         if(listShipping[i].data[j].checked== false ){

        //         };
        //     }
        // }
        this.shippingZoneService.createShippingZone(params).subscribe(res => {
            this.toastr.success(res.message);
            setTimeout(() => {
                this.router.navigate(['/admin-panel/shipping-zone']);
            }, 500);
            this.refresh();
        });
    }
    checkValidate(items, subItem, event) {
        if (this.isIE()) {
            if (subItem.id == 1) {
                items.forEach(item => {
                    if (item.id == 2 || item.id == 3) {
                        item.checked = false;
                    }
                });

            }
            else if ((subItem.id == 2 && subItem.checked) || (subItem.id == 3 && subItem.checked)) {
                if (items[0].id == 1 && items[0].checked) {
                    subItem.checked = false;
                    this.toastr.error('There is a conflict. You cannot active this Quote because Free Shipping is ON')
                    event.preventDefault();
                }

            }
        }
        else {
            if (subItem.id == 1 && !subItem.checked) {
                items.forEach(item => {
                    if (item.id == 2 || item.id == 3) {
                        return item.checked = false;
                    }
                });

            }
            else if ((subItem.id == 2 && !subItem.checked) || (subItem.id == 3 && !subItem.checked)) {
                if (items[0].id == 1 && items[0].checked) {
                    this.toastr.error('There is a conflict. You cannot active this Quote because Free Shipping is ON')
                    event.preventDefault();
                }

            }
        }



    }
    private isIE() {
        const match = navigator.userAgent.search(/(?:Edge|MSIE|Trident\/.*; rv:)/);
        let isIE = false;

        if (match !== -1) {
            isIE = true;
        }

        return isIE;
    }
    // checkDisabled(item,subItem){
    //     for(var i=0;i<item.length;i++){
    //         if(item[i].id==1&&item[i].checked){
    //             return true;
    //         }
    //     }
    //     return false;
    // }
    trackByFn(index, item) {
        return index; // or item.id
    }
    calculateStateLength(item) {
        var count = 0;
        item.forEach(res => {
            if (res.selected && !res.disable) {
                count++;
            }
        });
        return count;
    }
    checkState() {
        if (this.selectedCountry) {
            for (var i = 0; i < this.selectedCountry.state.length; i++) {
                if (this.selectedCountry.state[i].selected) {
                    if (i == this.selectedCountry.state.length - 1) {
                        return this.selectAll = true;
                    }
                }
                else {
                    return this.selectAll = false;
                }
            }
        }
    }
    selectState() {
        if (this.selectedCountry) {
            this.tempListState.forEach(item => {
                if (!item.disable) {
                    return item.selected = this.selectAll;
                }
            });
        }
    }
    back() {
        this.router.navigate(['/admin-panel/shipping-zone']);
    }
    selectTable() {
        this.selectedIndex[0] = 0;
        this.selectedIndex[1] = undefined;
        this.checkTable = false;
        this.table.scrollToBottom();
        // this.table.element.nativeElement.focus();
        setTimeout(() => {
            // this.table.element.nativeElement.focus();
            if (!this.checkTable) {
                if (this.table.element.nativeElement.querySelectorAll('.row-selected input')) {
                    this.tableDiv.nativeElement.focus();
                }
                }
        });
        this.refresh();
    }
}

