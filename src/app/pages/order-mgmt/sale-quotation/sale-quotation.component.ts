import { Component, ElementRef, OnInit, Renderer, ViewChild, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TableService } from './../../../services/table.service';
import { SaleQuoteKeyService } from './keys.list.control';

import { ToastrService } from 'ngx-toastr';
import { routerTransition } from '../../../router.animations';
import { OrderService } from '../order-mgmt.service';


@Component({
    selector: 'app-sale-quotation',
    templateUrl: './sale-quotation.component.html',
    styleUrls: ['./sale-quotation.component.scss'],
    providers: [SaleQuoteKeyService],
    animations: [routerTransition()]
})
export class SaleQuotationComponent implements OnInit {
    /**
     * letiable Declaration
     */
    @ViewChild('inp') inp: ElementRef;

    public listMaster = {};
    public selectedIndex = 0;
    public list = {
        items: []
    };
    public user: any;
    public onoffFilter: any;

    searchForm: FormGroup;

    constructor(public router: Router,
        public fb: FormBuilder,
        public toastr: ToastrService,
        public tableService: TableService,
        private orderService: OrderService,
        public saleQuoteKeyService: SaleQuoteKeyService,
        private renderer: Renderer) {

        this.searchForm = fb.group({
            'sale_quote_num': [null],
            'buyer_name': [null],
            'sts': [null],
            'type': [null],
            'date_from': [null],
            'date_to': [null]
        });

        //  Assign get list function name, override letiable here
        this.tableService.getListFnName = 'getList';
        this.tableService.context = this;
        //  Init Key
        this.saleQuoteKeyService.watchContext.next(this);
    }

    ngOnInit() {
        //  Init Fn
        this.listMaster['listFilter'] = [{ value: false, name: 'Date Filter' }];
        this.listMaster['dateType'] = [{ id: 'quote_date', name: 'Quote Date' }, { id: 'expiry_dt', name: 'Expiry Date' }, { id: 'ship_date', name: 'Delivery Date' }];
        this.getList();
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
    getListStatus() {
        this.orderService.getListSaleQuotationStatus().subscribe(res => {
            try {
                this.listMaster['listStatus'] = res.data;
            } catch (e) {
                console.log(e);
            }
        });
    }

    createOrder() {
        this.router.navigate(['/order-management/sale-quotation/create']);
    }

    moreFilter() {
        this.onoffFilter = !this.onoffFilter;
        setTimeout(() => {
            this.renderer.invokeElementMethod(this.inp.nativeElement, 'focus');
        }, 300);
    }

    sentMailToBuyer(id) {
        this.orderService.sentMailToBuyer(id).subscribe(res => {
            try {
                this.toastr.success(res.message);
                this.getList();
            } catch (e) {
                console.log(e);
            }
        });
    }

    approveByManager(id) {
        const params = { status: 'AM' };
        this.orderService.updateSaleQuoteStatus(id, params).subscribe(res => {
            try {
                this.toastr.success(res.message);
                this.getList();
            } catch (e) {
                console.log(e);
            }
        });

    }

    rejectByManager(id) {
        const params = { status: 'RM' };
        this.orderService.updateSaleQuoteStatus(id, params).subscribe(res => {
            try {
                this.toastr.success(res.message);
                this.getList();
            } catch (e) {
                console.log(e);
            }
        });

    }
    convertOrderToSO(id) {
        const params = {};
        this.orderService.convertOrderToSO(id, params).subscribe(res => {
            try {
                this.toastr.success(res.message);
                setTimeout(() => {
                    this.getList();
                  }, 100);
            } catch (e) {
                console.log(e);
            }
        });
    }

    getList() {
        const params = { ...this.tableService.getParams(), ...this.searchForm.value };
        params['type'] = 'SAQ';
        Object.keys(params).forEach((key) => {
            if (params[key] instanceof Array) {
              params[key] = params[key].join(',');
            }
            // tslint:disable-next-line:no-unused-expression
            (params[key] === null || params[key] ===  '') && delete params[key];
          });
        Object.keys(params).forEach((key) => (params[key] === null || params[key] === '') && delete params[key]);

        this.orderService.getListSalesQuotation(params).subscribe(res => {
            try {
                this.list.items = res.data.rows;
                this.tableService.matchPagingOption(res.data);
            } catch (e) {
                console.log(e);
            }
        });
    }

}
