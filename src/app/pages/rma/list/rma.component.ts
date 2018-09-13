import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { routerTransition } from '../../../router.animations';
import { TableService } from '../../../services/table.service';
import { PurchaseService } from '../../purchase-mgmt/purchase.service';
import { RMAKeyService } from './keys.control';

import { CommonService } from './../../../services/common.service';

import { ItemsControl } from '../../../../../node_modules/@ngu/carousel/src/ngu-carousel/ngu-carousel.interface';
@Component({
    selector: 'app-rma',
    templateUrl: './rma.component.html',
    styleUrls: ['./rma-list.component.scss'],
    animations: [routerTransition()],
    providers: [RMAKeyService, CommonService]
})
export class RmaComponent implements OnInit {

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
        private purchaseService: PurchaseService,
        public keyService: RMAKeyService,
        private commonService: CommonService
    ) {

        this.searchForm = fb.group({
            'rma_no': [null],
            'so_no': [null],
            'customer': [null],
            'rma_type': [''],
            'status': [''],
            'request_date_from': [null],
            'request_date_to': [null],
            'reception_date_from': [null],
            'reception_date_to': [null],
            'comment': []
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
    /**
     * Table Event
     */
    selectData(index) {
        console.log(index);
    }
    /**
     * Internal Function
     */
    toggleSubRow(id) {
        // tslint:disable-next-line:prefer-conditional-expression
        if (id === this.flagId) {
            this.flagId = '0';
        } else {
            this.flagId = id;
        }
        //   this.showProduct = !this.showProduct;
    }

    showMorefilter() {

    }

    sendMail(id) {
        const params = {
            'sts': 'SP'
        };
        this.purchaseService.sendMailPO(params, id).subscribe(res => {
            try {
                this.toastr.success(res.message);
                this.getList();
            } catch (e) {
                console.log(e);
            }
        });
    }

    sentToSuppPQ(id) {
        this.purchaseService.sentToSuppPQ(id).subscribe(res => {
            try {
                this.toastr.success(res.message);
                this.getList();
            } catch (e) {
                console.log(e);
            }
        });
    }

    approve(id) {
        this.purchaseService.aprvByMgrPQ(id).subscribe(res => {
            try {
                this.toastr.success(res.message);
                this.getList();
            } catch (e) {
                console.log(e);
            }
        });

    }

    reject(id) {
        this.purchaseService.rjtByMgrPQ(id).subscribe(res => {
            try {
                this.toastr.success(res.message);
                this.getList();
            } catch (e) {
                console.log(e);
            }
        });

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
        this.purchaseService.getListPurchaseOrder(params).subscribe(res => {
            try {
                this.list.items = res.data.rows;
                this.list.items.forEach(item => {
                    return item.collapseRows = false;
                });
                console.log(this.list.items);
                this.tableService.matchPagingOption(res.data);
            } catch (e) {
                console.log(e);
            }
        });
    }

}
