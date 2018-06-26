import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PurchaseService } from '../purchase.service';
import { TableService } from './../../../services/table.service';

import { ToastrService } from 'ngx-toastr';
import { routerTransition } from '../../../router.animations';

@Component({
  selector: 'app-purchase-order',
  templateUrl: './purchase-order.component.html',
  styleUrls: ['./purchase-order.component.scss'],
  animations: [routerTransition()]
})
export class PurchaseOrderComponent implements OnInit {

    /**
     * constiable Declaration
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
        public tableService: TableService, private purchaseService: PurchaseService) {
        this.searchForm = fb.group({
            'cd': [null],
            'purchase_quote_cd': [null],
            'supplier_id': [null],
            'contract_no': [null],
            'po_status_id': [null],
            'rqst_dt': [null]
        });

        // Assign get list function name, override constiable here
        this.tableService.getListFnName = 'getList';
        this.tableService.context = this;
    }

    ngOnInit() {
        // Init Fn
        this.listMoreFilter = [{ value: false, name: 'Requested On', type: 'date', model: 'rqst_dt' }];
        this.getList();
        this.getListSupplier();
        this.getListStatus();

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
         (id === this.flagId) ? this.flagId = '0' : this.flagId = id;
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

    getListSupplier() {
        const params = { page: 1, length: 100 };
        this.purchaseService.getListSupplier(params).subscribe(res => {
            try {
                this.listMaster['supplier'] = res.results.rows;
            } catch (e) {
                console.log(e);
            }
        });
    }

    getListStatus() {
        this.purchaseService.getListStatusOrder().subscribe(res => {
            try {
                this.listMaster['status'] = res.results;
            } catch (e) {
                console.log(e);
            }
        });
    }

    getList() {
        const params = {...this.tableService.getParams(), ...this.searchForm.value};
        Object.keys(params).forEach((key) => (params[key] === null || params[key] ===  '') && delete params[key]);

        this.purchaseService.getListPurchaseOrder(params).subscribe(res => {
            try {
                this.list.items = res.results.rows;
                this.tableService.matchPagingOption(res.results);
            } catch (e) {
                console.log(e);
            }
        });
    }

}
