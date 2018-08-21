import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { routerTransition } from '../../../../router.animations';
import { TableService } from '../../../../services/table.service';
import { ShippingZoneService } from '../shipping-zone.service';
import { ShippingZoneKeyService } from './keys.control';
import { CommonService } from './../../../../services/common.service';
import { ItemsControl } from '../../../../../../node_modules/@ngu/carousel/src/ngu-carousel/ngu-carousel.interface';
@Component({
    selector: 'app-shipping-zone',
    templateUrl: './shipping-zone.component.html',
    styleUrls: ['../shipping-zone.component.scss'],
    animations: [routerTransition()],
    providers: [ShippingZoneKeyService, CommonService]
})
export class ShippingZoneComponent implements OnInit {

    /**
     * letiable Declaration
     */
    public listMaster = {};
    public selectedIndex = 0;
    public list = {
        items: []
    };
    //  public showProduct: boolean = false;
    public onoffFilter: any;
    public flagId = '';

    public user: any;
    public listMoreFilter: any = [];

    searchForm: FormGroup;

    constructor(public router: Router,
        public fb: FormBuilder,
        public toastr: ToastrService,
        private vRef: ViewContainerRef,
        public tableService: TableService,
        private shippingZoneService: ShippingZoneService,
        public keyService: ShippingZoneKeyService,
        private commonService: CommonService
    ) {

        this.searchForm = fb.group({
            'zone_name': [null],
            'country_code':[null],
            'status':[null]
        });

        // Assign get list function name, override letiable here
        this.tableService.getListFnName = 'getList';
        this.tableService.context = this;
        //  Init Key
        this.keyService.watchContext.next(this);
    }

    ngOnInit() {
        // Init Fn
        this.listMoreFilter = { value1: false, value2: false };
        this.getList();
        this.getListMaster();

        this.user = JSON.parse(localStorage.getItem('currentUser'));
    }






    getListMaster() {
        this.commonService.getMasterData().subscribe(res => {
            const data = res.data;
            console.log(data);
            this.listMaster['rma_type'] = data.rma_type;
            this.listMaster['status'] = data.rma_status;
        });
    }

    getList() {
        const params = { ...this.tableService.getParams(), ...this.searchForm.value };
        Object.keys(params).forEach((key) => (params[key] === null || params[key] === '') && delete params[key]);
        console.log(params);
        this.shippingZoneService.getList(params).subscribe(res => {
            try {
                this.list.items = res.data.rows;
                console.log(this.list.items);
                this.tableService.matchPagingOption(res.data);
            } catch (e) {
                console.log(e);
            }
        });
    }
    createShippingZone(){
        console.log('open createShipping');
        // setTimeout(() => {
        this.router.navigate(['/admin-panel/shipping-zone/create']);
        // },500);
    }

}
