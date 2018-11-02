import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { cdArrowTable } from '../../../../../shared';
import { Helper } from '../../../../../shared/helper/common.helper';
import { RMAService } from '../../../../order-mgmt/rma/rma.service';
import { CustomerService } from '../../../customer.service';
import { CustomerKeyViewService } from '../../view/keys.view.control';
import { TableService } from './../../../../../services/table.service';

// tslint:disable-next-line:import-blacklist
import { Subject } from 'rxjs';
import { environment } from '../../../../../../environments/environment';
import { JwtService } from '../../../../../shared/guard/jwt.service';

@Component({
    selector: 'app-customer-rma-tab',
    templateUrl: './rma-tab.component.html',
    styleUrls: ['../information-tab.component.scss'],
    providers: [HotkeysService, CustomerKeyViewService, RMAService],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerRMATabComponent implements OnInit, OnDestroy {

    /**
     * letiable Declaration
     */

    public _customerId;
    @Input() set customerId(id) {
        if (id) {
            this._customerId = id;
            this.getList();
        }
    }

    public listMaster = {};

    public list = {
        items: []
    };

    searchForm: FormGroup;
    public data = {};
    public selectedIndex = 0;
    @ViewChild(cdArrowTable) table: cdArrowTable;

    public searchKey = new Subject<any>();
    constructor(
        private jwtService: JwtService,
        public fb: FormBuilder,
        private vRef: ViewContainerRef,
        public tableService: TableService,
        public _hotkeysServiceRMA: HotkeysService,
        private helper: Helper,
        private rmaService: RMAService,
        private customerService: CustomerService, private cd: ChangeDetectorRef) {

        this.searchForm = fb.group({
            'cd': [null],
            'return_type_id': [null],
            'company_id': [null],
            'warehouse_id': [null],
            'sts_id': [null],
            'request_date_to': [null],
            'request_date_from': [null],
        });

        //  Assign get list function name, override letiable here
        this.tableService.getListFnName = 'getList';
        this.tableService.context = this;
        this.initKeyBoard();
    }

    ngOnInit() {
        this.getRMAReference();
        // Lazy Load filter
        this.data['page'] = 1;
        const params = { page: this.data['page'], length: 100 };
        this.rmaService.getAllCustomer(params).subscribe(res => {
            this.listMaster['customer'] = res.data.rows;
            this.data['total_page'] = res.data.total_page;
            this.refresh();
        });
        this.searchKey.debounceTime(300).subscribe(key => {
            this.data['page'] = 1;
            this.searchCustomer(key);
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
        this.rmaService.getAllCustomer(params).subscribe(res => {
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
        this.rmaService.getAllCustomer(params).subscribe(res => {
            this.listMaster['customer'] = res.data.rows;
            this.data['total_page'] = res.data.total_page;
            this.refresh();
        });
    }
    /**
     * Internal Function
     */
    selectData(index) {
        console.log(index);
    }

    refresh() {
        if (!this.cd['destroyed']) { this.cd.detectChanges(); }
    }

    getRMAReference() {
        this.rmaService.getOrderReference().subscribe(res => {
            this.listMaster['warehouses'] = res.data.warehouses || []; this.refresh();
        });
        this.rmaService.getRMAReference().subscribe(res => {
            this.listMaster['return_status'] = res.data.return_status || [];
            this.listMaster['return_type'] = res.data.return_type || [];
            this.refresh();
        });
    }

    getList() {
        const params = {...this.tableService.getParams(), ...this.searchForm.value};
        Object.keys(params).forEach((key) => (params[key] === null || params[key] ===  '') && delete params[key]);

        this.customerService.getListRMA(this._customerId, params).subscribe(res => {
            try {
                this.list.items = res.data.rows || [];
                this.tableService.matchPagingOption(res.data);
                this.refresh();
            } catch (e) {
                console.log(e);
            }
        });
    }

    exportData() {
        const anchor = document.createElement('a');
        const path = 'buyer/export-return-order/';
        const file = `${environment.api_url}${path}${this._customerId}`;
        const headers = new Headers();
        headers.append('Authorization', 'Bearer ' + this.jwtService.getToken());
        fetch(file, { headers })
            .then(response => response.blob())
            .then(blobby => {
            const objectUrl = window.URL.createObjectURL(blobby);
            anchor.href = objectUrl;
            anchor.download = 'return_order_export.xls';
            anchor.click();
            window.URL.revokeObjectURL(objectUrl);
        });
    }

    selectTable() {
        this.selectedIndex = 0;
        this.table.element.nativeElement.querySelector('td a').focus();
        this.refresh();
    }
    initKeyBoard() {
        this.data['key_config'] = {
            code: {
                element: null,
                focus: true,
            },
        };

        this._hotkeysServiceRMA.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+f1', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            event.preventDefault();
            if (this.data['key_config'].code.element) {
                this.data['key_config'].code.element.nativeElement.focus();
            }
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Focus'));

        this._hotkeysServiceRMA.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+e', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            this.tableService.searchAction();
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Search'));
        this._hotkeysServiceRMA.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+t', (event: KeyboardEvent): boolean => {
            (document.activeElement as HTMLInputElement).blur();
            event.preventDefault();
            this.selectTable();
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Select Table'));
        this._hotkeysServiceRMA.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+r', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            this.tableService.resetAction(this.searchForm);
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Reset'));
        this._hotkeysServiceRMA.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+x', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            this.exportData();
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Export'));
        this._hotkeysServiceRMA.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+u', (event: KeyboardEvent): boolean => {
            this.tableService.pagination.page--;
            if (this.tableService.pagination.page < 1) {
                this.tableService.pagination.page = 1;
                return;
            }
            this.tableService.changePage(this.tableService.pagination.page);
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Previous page'));

        this._hotkeysServiceRMA.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+y', (event: KeyboardEvent): boolean => {
            this.tableService.pagination.page++;
            if (this.tableService.pagination.page > this.tableService.pagination.total_page) {
                this.tableService.pagination.page = this.tableService.pagination.total_page;
                return;
            }
            this.tableService.changePage(this.tableService.pagination.page);
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Next page'));
    }

    resetKeys() {
        const keys = Array.from(this._hotkeysServiceRMA.hotkeys);
        keys.map(key => {
            this._hotkeysServiceRMA.remove(key);
        });
    }

    ngOnDestroy() {
       this.resetKeys();
    }


}
