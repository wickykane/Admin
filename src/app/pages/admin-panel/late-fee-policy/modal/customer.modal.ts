import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { ToastrService } from 'ngx-toastr';
import { cdArrowTable } from '../../../../shared';
import { Helper } from '../../../../shared/helper/common.helper';
import { CustomerService } from '../../../customer-mgmt/customer.service';
import { LateFeePolicyService } from '../late-fee-policy.service';
import { TableService } from './../../../../services/table.service';

@Component({
    selector: 'app-customer-modal-content',
    templateUrl: './customer.modal.html',
    providers: [CustomerService, LateFeePolicyService, HotkeysService],
    changeDetection: ChangeDetectionStrategy.OnPush
})
// tslint:disable-next-line:component-class-suffix
export class CustomerModalContent implements OnInit, OnDestroy {
    @Input() id;
    @Input() flagBundle;

    /**
     * Variable Declaration
     */
    public listMaster = {};
    public selectedIndex = 0;
    public list = {
        items: [],
        checklist: []
    };
    public checkAllItem;
    public data = {};
    public searchForm: FormGroup;
    public filterForm: FormGroup;
    @ViewChild(cdArrowTable) table: cdArrowTable;
    constructor(public activeModal: NgbActiveModal,
        private cd: ChangeDetectorRef,
        public customerService: CustomerService,
        public lateFeePolicyService: LateFeePolicyService,
        public fb: FormBuilder,
        public toastr: ToastrService,
        public tableService: TableService,
        private helper: Helper,
        public _hotkeysService: HotkeysService) {

        this.searchForm = fb.group({
            'cus_name': [null],
            'cus_code': [null],
            'cus_type': [null]
        });

        //  Assign get list function name, override variable here
        this.tableService.getListFnName = 'getList';
        this.tableService.context = this;
    }

    ngOnInit() {
        //  Init Fn
        this.listMaster['buyerType'] = [
            { code: 'CP', name: 'Company' },
            { code: 'PS', name: 'Personal' }
        ];
        this.getList();
        this.initKeyBoard();
    }

    // Table event
    refresh() {
         if (!this.cd['destroyed']) { this.cd.detectChanges(); }
    }

    selectData(index) {
        console.log(index);
    }

    checkAll(ev) {
        this.list.items.forEach(x => x.is_checked = ev.target.checked);
        this.list.checklist = this.list.items.filter(_ => _.is_checked);
    }

    isAllChecked() {
        this.checkAllItem = this.list.items.every(_ => _.is_checked);
        this.list.checklist = this.list.items.filter(_ => _.is_checked);
    }

    /**
     * Internal Function
     */

    getListCustomerType() {
        this.lateFeePolicyService.getListCustomerType().subscribe(res => {
            try {
                this.listMaster['buyerType'] = res.data;
                this.refresh();
            } catch (e) {
                console.log(e);
            }
        });
    }

    getList() {
        let params = {
            using_for: 'lfp'
        };
        params = { ...this.tableService.getParams(), ...this.searchForm.value, ...params };
        Object.keys(params).forEach((key) => (params[key] === null || params[key] === '') && delete params[key]);

        this.lateFeePolicyService.getListCustomer(params).subscribe(res => {
            try {
                this.list.items = res.data.rows;
                this.tableService.matchPagingOption(res.data);
                this.refresh();
            } catch (e) {
                console.log(e);
            }

        });

    }

    convertCustomerType(code) {
        const type = this.listMaster['buyerType'].find(item => item.code === code);
        return type.name;
    }
    ok() {
        this.activeModal.close(this.searchForm.value);
      }

    cancel() {
    this.activeModal.dismiss();
    }
    initKeyBoard() {
        this.data['key_config'] = {
            cus_name: {
                element: null,
                focus: true,
            },
        };

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+f1', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            event.preventDefault();
            if (this.data['key_config'].cus_name.element) {
                this.data['key_config'].cus_name.element.nativeElement.focus();
            }
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Focus'));

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+e', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            this.tableService.searchAction();
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Search'));

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+r', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            this.tableService.resetAction(this.searchForm);
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Reset'));

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+o', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            this.ok();
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'OK'));
        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+pageup', (event: KeyboardEvent): boolean => {
            this.tableService.pagination.page--;
            if (this.tableService.pagination.page < 1) {
                this.tableService.pagination.page = 1;
                return;
            }
            this.tableService.changePage(this.tableService.pagination.page);
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Previous page'));

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+pagedown', (event: KeyboardEvent): boolean => {
            this.tableService.pagination.page++;
            if (this.tableService.pagination.page > this.tableService.pagination.total_page) {
                this.tableService.pagination.page = this.tableService.pagination.total_page;
                return;
            }
            this.tableService.changePage(this.tableService.pagination.page);
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Next page'));
        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+backspace', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            event.preventDefault();
            this.cancel();
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Cancel'));
    }

    resetKeys() {
        const keys = Array.from(this._hotkeysService.hotkeys);
        keys.map(key => {
            this._hotkeysService.remove(key);
        });
    }

    ngOnDestroy() {
        this.resetKeys();
    }


}
