import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbDateParserFormatter, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { routerTransition } from '../../../../router.animations';
import { TableService } from '../../../../services/table.service';
import { NgbDateCustomParserFormatter } from '../../../../shared/helper/dateformat';
import { ConfirmModalContent } from '../../../../shared/modals/confirm.modal';

import { HotkeysService } from 'angular2-hotkeys';
// tslint:disable-next-line:import-blacklist
import { Subject } from 'rxjs';
import { RMAService } from '../rma.service';
import { CommonService } from './../../../../services/common.service';
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
    public data = {};
    public listMoreFilter: any = [];
    public searchKey = new Subject<any>();

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
            'cd': [null],
            'return_type_id': [null],
            'company_id': [null],
            'warehouse_id': [null],
            'sts_id': [null],
            'buyer_name': [null],
            // 'date_type': [null],
            'request_date_to': [null],
            'request_date_from': [null],

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

        this.getRMAReference();
        this.countOrderStatus();
        this.getList();

        // Lazy Load filter
        this.data['page'] = 1;
        const params = { page: this.data['page'], length: 100 };
        this.service.getAllCustomer(params).subscribe(res => {
            this.listMaster['customer'] = res.data.rows;
            this.data['total_page'] = res.data.total_page;
            this.refresh();
        });
        this.searchKey.debounceTime(300).subscribe(key => {
            this.data['page'] = 1;
            this.searchCustomer(key);
        });

        this.refresh();
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

    getRMAReference() {
        this.service.getOrderReference().subscribe(res => {
            this.listMaster['warehouses'] = res.data.warehouses || []; this.refresh();
        });
        this.service.getRMAReference().subscribe(res => {
            this.listMaster['return_status'] = res.data.return_status || [];
            this.listMaster['return_type'] = res.data.return_type || [];
            this.refresh();
        });

    }

    fetchMoreCustomer(data?) {
        this.data['page']++;
        if (this.data['page'] > this.data['total_page']) {
            return;
        }
        const params = { page: this.data['page'], length: 100 };
        if (this.data['searchKey']) {
            params['company_name'] = this.data['searchKey'];
        }
        this.service.getAllCustomer(params).subscribe(res => {
            this.listMaster['customer'] = this.listMaster['customer'].concat(res.data.rows);
            this.data['total_page'] = res.data.total_page;
            this.refresh();
        });
    }

    searchCustomer(key) {
        this.data['searchKey'] = key;
        const params = { page: this.data['page'], length: 100 };
        if (key) {
            params['company_name'] = key;
        }
        this.service.getAllCustomer(params).subscribe(res => {
            this.listMaster['customer'] = res.data.rows;
            this.data['total_page'] = res.data.total_page;
            this.refresh();
        });
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
        //
        // params.order = 'id';
        // params.sort = 'desc';

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
        //         this.router.navigate(['/order-management/return-order/edit', res.data.id]);
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
