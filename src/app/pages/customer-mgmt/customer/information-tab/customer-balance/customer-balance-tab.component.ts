import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '../../../customer.service';

import { NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { TableService } from '../../../../../services/table.service';
import { cdArrowTable } from '../../../../../shared';
import { Helper } from '../../../../../shared/helper/common.helper';
import { CustomerKeyViewService } from '../../view/keys.view.control';

import { environment } from '../../../../../../environments/environment';
import { JwtService } from '../../../../../shared/guard/jwt.service';

@Component({
    selector: 'app-customer-customer-balance-tab',
    templateUrl: './customer-balance-tab.component.html',
    styleUrls: ['../information-tab.component.scss'],
    providers: [HotkeysService, CustomerKeyViewService],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerCustomerBalanceTabComponent implements OnInit, OnDestroy {

    /**
     * letiable Declaration
     */

    public _customerId;
    public listReference: any = {};
    @Input() set customerId(id) {
        if (id) {
            this._customerId = id;
            this.getList();
        }
    }

    public listMaster = {};
    public list: any = {
        content: [],
        total: []
    };

    searchForm: FormGroup;
    public data = {};
    public selectedIndex = 0;
    @ViewChild(cdArrowTable) table: cdArrowTable;
    constructor(
        private jwtService: JwtService,
        public fb: FormBuilder,
        private vRef: ViewContainerRef,
        public tableService: TableService,
        public _hotkeysServiceBalance: HotkeysService,
        private helper: Helper,
        private customerService: CustomerService,
        private cd: ChangeDetectorRef,
        private modalService: NgbModal) {
        this.searchForm = fb.group({
            'subsidiary': [null],
            'year': [null]
        });

        //  Assign get list function name, override letiable here
        this.tableService.getListFnName = 'getList';
        this.tableService.context = this;
        this.initKeyBoard();
    }

    ngOnInit() {
        this.getListReference();
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

    getListReference() {
        this.customerService.getListCustomerBalanceReference().subscribe(res => {
            try {
                this.listReference = res.data || {};
                this.refresh();
            } catch (e) {
                console.log(e);
            }
        });
    }
    getList() {
        const params = { ...this.searchForm.value };
        Object.keys(params).forEach((key) => (params[key] === null || params[key] === '') && delete params[key]);

        this.customerService.getListCustomerBalance(this._customerId, params).subscribe(res => {
            try {
                this.list =  res.data || this.list;
                console.log(this.list);
                // this.tableService.matchPagingOption(res.data);
                this.refresh();
            } catch (e) {
                console.log(e);
            }
        });
    }
    exportData() {
        const anchor = document.createElement('a');
        const path = 'buyer/export-customer-balance/';
        const file = `${environment.api_url}${path}${this._customerId}`;
        const headers = new Headers();
        headers.append('Authorization', 'Bearer ' + this.jwtService.getToken());
        fetch(file, { headers })
            .then(response => response.blob())
            .then(blobby => {
            const objectUrl = window.URL.createObjectURL(blobby);
            anchor.href = objectUrl;
            anchor.download = 'customer_balance_export.xls';
            anchor.click();
            window.URL.revokeObjectURL(objectUrl);
        });
    }
    checkRelated(item) {
        return Array.isArray(item);
       }
       openVerticallyCentered(contenlink) {
        this.modalService.open(contenlink);
      }
      selectTable() {
        this.selectedIndex = 0;
        this.table.element.nativeElement.querySelector('td').focus();
    }
      initKeyBoard() {
        this.data['key_config'] = {
            subsidiary: {
                element: null,
                focus: true,
            },
            year: {
                element: null,
                focus: true,
            },
        };
        // saveKeys() {
        //     this.keys = this.getKeys();
        //     this.context.data['tableKey'] = this.context.table.getKeys();
        //     this.resetKeys();
        //     this.context.table.resetKeys();
        // }

        this._hotkeysServiceBalance.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+f1', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            event.preventDefault();
            if (this.data['key_config'].subsidiary.element) {
                this.data['key_config'].subsidiary.element.nativeElement.focus();
            }
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Focus Subsidiary'));

        this._hotkeysServiceBalance.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+f2', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            event.preventDefault();
            if (this.data['key_config'].year.element) {
                this.data['key_config'].year.element.nativeElement.focus();
            }
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Focus Year'));
        this._hotkeysServiceBalance.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+t', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            this.selectTable();
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Select Table'));
        this._hotkeysServiceBalance.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+e', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            this.tableService.searchAction();
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Search'));

        this._hotkeysServiceBalance.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+r', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            this.tableService.resetAction(this.searchForm);
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Reset'));
        this._hotkeysServiceBalance.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+x', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            this.exportData();
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Export'));
    }
    resetKeys() {
        const keys = Array.from(this._hotkeysServiceBalance.hotkeys);
        keys.map(key => {
            this._hotkeysServiceBalance.remove(key);
        });
    }

    ngOnDestroy() {
       this.resetKeys();
    }
}
