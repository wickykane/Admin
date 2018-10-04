import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbDateParserFormatter, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { routerTransition } from '../../../router.animations';
import { TableService } from '../../../services/table.service';
import { NgbDateCustomParserFormatter } from '../../../shared/helper/dateformat';
import { ConfirmModalContent } from '../../../shared/modals/confirm.modal';

import { HotkeysService } from 'angular2-hotkeys';
import { RMAService } from '../rma.service';
import { CommonService } from './../../../services/common.service';
import { RMAKeyService } from './keys.control';


@Component({
    selector: 'app-rma',
    templateUrl: './rma.component.html',
    styleUrls: ['../rma.component.scss'],
    providers: [RMAKeyService, TableService, { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }],
    animations: [routerTransition()],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RmaComponent implements OnInit {

    /**
     * Variable Declaration
     */
    public messageConfig = {
        'SM': 'Are you sure that you want to submit current order ?',
        'CC': 'Are you sure that you want to cancel current order?',
        'AP': 'Are you sure that you want to approve current order?',
        'RJ': 'Are you sure that you want to reject current order?',
        'RV': 'Are you sure that you want to revise current order?',
    };

    public statusConfig = {
        'NW': { color: 'blue', name: 'New', img: './assets/images/icon/new.png' },
        'SM': { color: 'texas-rose', name: 'Submited' },
        'AP': { color: 'strong-green', name: 'Approved', img: './assets/images/icon/approved.png' },
        'IP': { color: 'rock-blue', name: 'Allocated' },
        'PP': { color: 'green', name: 'Preparing' },
        'RS': { color: 'darkblue', name: 'Ready To Ship' },
        'DL': { color: 'pink', name: 'Delivering' },
        'PD': { color: 'bright-grey', name: 'Partial Delivery' },
        'CP': { color: 'lemon', name: 'Completed', img: './assets/images/icon/full_delivered.png' },
        'RJ': { color: 'magenta', name: 'Rejected' },
        'CC': { color: 'red', name: 'Canceled', img: './assets/images/icon/cancel.png' },
    };

    public listMaster = {};
    public selectedIndex = 0;
    public countStatus = [];
    public list = {
        items: []
    };
    //  public showProduct: boolean = false;
    public onoffFilter: any;
    public listMoreFilter: any = [];

    searchForm: FormGroup;

    constructor(public router: Router,
        private cd: ChangeDetectorRef,
        public fb: FormBuilder,
        public toastr: ToastrService,
        private vRef: ViewContainerRef,
        public keyService: RMAKeyService,
        private modalService: NgbModal,
        public tableService: TableService,
        private service: RMAService,
        private _hotkeysService: HotkeysService) {

        this.searchForm = fb.group({
            'code': [null],
            'cus_po': [null],
            'sale_quote_num': [null],
            'type': [null],
            'sts': [null],
            'buyer_name': [null],
            'date_type': [null],
            'date_to': [null],
            'date_from': [null],

        });

        //  Assign get list function name, override letiable here
        this.tableService.getListFnName = 'getList';
        this.tableService.context = this;

          this.keyService.watchContext.next({ context: this, service: this._hotkeysService });
    }

    ngOnInit() {
        //  Init Fn
        this.listMoreFilter = [{ value: false, name: 'Date Filter' }];
        this.listMaster['dateType'] = [{ id: 'order_dt', name: 'Order Date' }, { id: 'delivery_dt', name: 'Delivery Date' }];
        this.listMaster['type'] = [{ id: 'PKU', name: 'Pickup ' }, { id: 'NO', name: 'Regular Order' }, { id: 'ONL', name: 'Ecommerce' }, { id: 'XD', name: 'X-Docks' }];

        this.getList();
        this.getListStatus();
        this.countOrderStatus();
    }
    /**
     * Table Event
     */
    refresh() {
        this.cd.detectChanges();
    }

    selectData(index) {
        console.log(index);
    }
    /**
     * Internal Function
     */

    filter(status) {
        this.list.items = [{}, {}];
        // const params = { sts: status };
        // this.service.getListOrder(params).subscribe(res => {
        //     try {
        //         this.list.items = res.data.rows;
        //         this.tableService.matchPagingOption(res.data);
        //         this.refresh();
        //     } catch (e) {
        //         console.log(e);
        //     }
        // });
    }

    countOrderStatus() {
      this.countStatus = [{}, {}];
        // this.service.countStatus().subscribe(res => {
        //     res.data.map(item => {
        //         if (this.statusConfig[item.short_name]) {
        //             this.statusConfig[item.short_name].count = item.count;
        //             this.statusConfig[item.short_name].status = item.id;
        //             this.statusConfig[item.short_name].name = item.name;
        //         }
        //     });
        //     this.countStatus = Object.keys(this.statusConfig).map(key => {
        //         return this.statusConfig[key];
        //     });
        //     this.refresh();
        // });
    }

    getListStatus() {
        this.listMaster['status'] = [{}, {}];
        // this.service.getListStatus().subscribe(res => {
        //     this.listMaster['status'] = res.data;
        //     this.refresh();
        // });

    }

    getList() {
        const params = { ...this.tableService.getParams(), ...this.searchForm.value };

        Object.keys(params).forEach((key) => {
            if (params[key] instanceof Array) {
                params[key] = params[key].join(',');
            }
            // tslint:disable-next-line:no-unused-expression
            (params[key] === null || params[key] === '') && delete params[key];
        });

        params.order = 'id';
        params.sort = 'desc';

        this.list.items = [{}, {}];

        this.service.getListRMA(params).subscribe(res => {
            try {
                this.list.items = res.data.rows;
                this.tableService.matchPagingOption(res.data);
                this.refresh();
            } catch (e) {
                console.log(e);
            }
        });
    }


    confirmModal(id, status) {
        const modalRef = this.modalService.open(ConfirmModalContent, { size: 'lg', windowClass: 'modal-md' });
        modalRef.result.then(res => {
            if (res) {
                switch (status) {
                    case 'SM':
                        this.updateStatusOrder(id, 6);
                        break;
                    case 'AP':
                        this.putApproveOrder(id);
                        break;
                    case 'RJ':
                        this.updateStatusOrder(id, 11);
                        break;
                    case 'CC':
                        this.updateStatusOrder(id, 7);
                        break;
                    case 'RO':
                        this.updateStatusOrder(id, 1);
                        break;
                    case 'CLONE':
                        this.cloneNewOrder(id);
                        break;
                }
            }
        }, dismiss => { });
        modalRef.componentInstance.message = this.messageConfig[status];
        modalRef.componentInstance.yesButtonText = 'Yes';
        modalRef.componentInstance.noButtonText = 'No';
    }

    cloneNewOrder(id) {
        // this.service.cloneOrder(id).subscribe(res => {
        //     this.toastr.success(res.message);
        //     setTimeout(() => {
        //         this.router.navigate(['/order-management/sale-order/edit', res.data.id]);
        //     }, 1000);
        // }
        // );
    }

    putApproveOrder(order_id) {

        // this.service.approveOrd(order_id).subscribe(res => {
        //
        //     this.toastr.success(res.message);
        //     setTimeout(() => {
        //         this.getList();
        //     }, 500);
        //
        // }
        // );
    }

    updateStatusOrder(order_id, status) {
        // this.service.updateStatusOrder(order_id, status).subscribe(res => {
        //
        //     this.toastr.success(res.message);
        //     setTimeout(() => {
        //         this.getList();
        //     }, 500);
        // }
        // );
    }

}
