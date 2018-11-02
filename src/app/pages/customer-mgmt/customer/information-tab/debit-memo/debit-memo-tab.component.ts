import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { environment } from '../../../../../../environments/environment';
import { TableService } from '../../../../../services/table.service';
import { cdArrowTable, JwtService } from '../../../../../shared';
import { Helper } from '../../../../../shared/helper/common.helper';
import { DebitMemoService } from '../../../../financial/debit-memo/debit-memo.service';
import { CustomerService } from '../../../customer.service';


@Component({
    selector: 'app-customer-debit-memo-tab',
    templateUrl: './debit-memo-tab.component.html',
    styleUrls: ['../information-tab.component.scss'],
    providers: [HotkeysService, DebitMemoService]
})
export class CustomerDebitMemoTabComponent implements OnInit, OnDestroy {

    public _customerId;
    @Input() set customerId(id) {
        if (id) {
            this._customerId = id;
            this.getList();
        }
    }
    public listMaster = {};
    public data = {};
    public list = {
        items: []
    };
    public selectedIndex = 0;
    searchForm: FormGroup;
    @ViewChild(cdArrowTable) table: cdArrowTable;
    constructor(
        public fb: FormBuilder,
        private customerService: CustomerService,
        public _hotkeysServiceDebit: HotkeysService,
        public debitMemoService: DebitMemoService,
        private jwtService: JwtService,
        public tableService: TableService,
        private helper: Helper,
        private cd: ChangeDetectorRef,
    ) {
        this.searchForm = fb.group({
            no: [null],
            company_name: [null],
            sts: [null],
            date_type: [null],
            date_from: [null],
            date_to: [null]
        });
        this.tableService.getListFnName = 'getList';
        this.tableService.context = this;
        this.initKeyBoard();
    }
    ngOnInit() {
        this.listMaster['dateType'] = [
            { id: null, name: 'Issue Date' },
            { id: 1, name: 'Due Date' }
        ];
        this.getDebitStatusList();
     }
     getDebitStatusList() {
        this.debitMemoService.getDebitStatusList().subscribe(
            res => {
                try {
                    this.listMaster['status'] = res.data;
                    this.refresh();
                } catch (err) {
                    console.log(err);
                }
            }, err => {
                console.log(err);
            }
        );
    }
    getList() {
        const params = { ...this.tableService.getParams(), ...this.searchForm.value};
        if (params['date_type']) {
            params['due_date_from'] = params['date_from'];
            params['due_date_to'] = params['date_to'];
        } else {
            params['issue_date_from'] = params['date_from'];
            params['issue_date_to'] = params['date_to'];
        }
        Object.keys(params).forEach((key) => {
            if (params[key] instanceof Array) {
                params[key] = params[key].join(',');
            }
            // tslint:disable-next-line:no-unused-expression
            (params[key] === null || params[key] === '' || key === 'date_type' || key === 'date_from' || key === 'date_to') && delete params[key];
        });
        // params.order = 'id';
        // params.sort = 'desc';
        this.customerService.getListDebit(this._customerId, params).subscribe(
            res => {
                try {
                    this.list.items = res.data.rows || [];
                    this.selectedIndex = 0;
                    this.tableService.matchPagingOption(res.data);
                    this.refresh();
                } catch (err) {
                    console.log(err);
                }
            }, err => {
                console.log(err);
            }
        );
    }

    refresh() {
        if (!this.cd['destroyed']) { this.cd.detectChanges(); }
    }
    selectTable() {
        this.selectedIndex = 0;
        this.table.element.nativeElement.querySelector('td a').focus();
    }
    exportData() {
        const anchor = document.createElement('a');
        const path = 'buyer/export-debit-memo/';
        const file = `${environment.api_url}${path}${this._customerId}`;
        const headers = new Headers();
        headers.append('Authorization', 'Bearer ' + this.jwtService.getToken());
        fetch(file, { headers })
            .then(response => response.blob())
            .then(blobby => {
                const objectUrl = window.URL.createObjectURL(blobby);
            anchor.href = objectUrl;
            anchor.download = 'debit_memos.xls';
            anchor.click();
            window.URL.revokeObjectURL(objectUrl);
        });
    }
    initKeyBoard() {
        this.data['key_config'] = {
            no: {
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
        this._hotkeysServiceDebit.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+f1', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            event.preventDefault();
            if (this.data['key_config'].no.element) {
                this.data['key_config'].no.element.nativeElement.focus();
            }
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Focus'));

        this._hotkeysServiceDebit.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+e', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            this.tableService.searchAction();
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Search'));
        this._hotkeysServiceDebit.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+t', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            this.selectTable();
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Select Table'));
        this._hotkeysServiceDebit.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+r', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            this.tableService.resetAction(this.searchForm);
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Reset'));

        this._hotkeysServiceDebit.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+x', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            this.exportData();
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Export'));

        this._hotkeysServiceDebit.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+u', (event: KeyboardEvent): boolean => {
            this.tableService.pagination.page--;
            if (this.tableService.pagination.page < 1) {
                this.tableService.pagination.page = 1;
                return;
            }
            this.tableService.changePage(this.tableService.pagination.page);
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Previous page'));

        this._hotkeysServiceDebit.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+y', (event: KeyboardEvent): boolean => {
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
        const keys = Array.from(this._hotkeysServiceDebit.hotkeys);
        keys.map(key => {
            this._hotkeysServiceDebit.remove(key);
        });
    }

    ngOnDestroy() {
        this.resetKeys();
    }
}
