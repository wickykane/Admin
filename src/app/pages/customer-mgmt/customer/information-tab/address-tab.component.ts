import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Input, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { TableService } from '../../../../services/table.service';
import { cdArrowTable } from '../../../../shared';
import { Helper } from '../../../../shared/helper/common.helper';
import { CustomerService } from '../../customer.service';
import { CustomerViewComponent } from '../customer-view.component';
import { CustomerKeyViewService } from '../keys.view.control';

@Component({
    selector: 'app-customer-address-tab',
    templateUrl: './address-tab.component.html',
    styleUrls: ['./information-tab.component.scss'],
    providers: [HotkeysService, CustomerKeyViewService],
   changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerAddressTabComponent implements OnInit, OnDestroy {

    /**
     * letiable Declaration
     */
    @Input() set listData(data) {
        this.list.items = data || [];
    }

    public list = {
        items: []
    };
    @ViewChild(cdArrowTable) table: cdArrowTable;
    public data = {};
    public selectedIndex = 0;
    constructor(
        public router: Router,
        private customerService: CustomerService,
        private cd: ChangeDetectorRef,
        public _hotkeysServiceAddress: HotkeysService,
        private helper: Helper,
        public tableService: TableService,
        public keyService: CustomerKeyViewService
        ) { }
    ngOnInit() {
        this.customerService.getRoute().subscribe(res => {
            let t = setInterval(() => {
                for (let i = 0; i < this.list.items.length; i++) {
                    if (this.list.items[i].route_id > 0) {
                        clearInterval(t);
                        console.log(this.list.items[i]);
                        for (let j = 0; j < res.data.length; j++) {
                            if (res.data[j].id == this.list.items[i].route_id) {
                                this.list.items[i]['route_name'] = res.data[j].route_gatetime;
                                console.log(res.data[j].route_gatetime);
                            }
                        }
                    }
                }
            }, 500);
            this.refresh();
        });
        this.initKeyBoard();
        // this.changeShortcut();
    }
    selectData(index) {
        console.log(index);
    }
    selectTable() {
        this.selectedIndex = 0;
        this.table.element.nativeElement.querySelector('tr td').focus();
    }
    refresh() {
         if (!this.cd['destroyed']) { this.cd.detectChanges(); }
    }

    initKeyBoard() {

        this._hotkeysServiceAddress.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+t', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            this.selectTable();
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Select Table'));

        this._hotkeysServiceAddress.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+right', (event: KeyboardEvent): boolean => {
            this.tableService.pagination.page--;
            if (this.tableService.pagination.page < 1) {
                this.tableService.pagination.page = 1;
                return;
            }
            this.tableService.changePage(this.tableService.pagination.page);
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Previous page'));

        this._hotkeysServiceAddress.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+left', (event: KeyboardEvent): boolean => {
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
        const keys = Array.from(this._hotkeysServiceAddress.hotkeys);
        keys.map(key => {
            this._hotkeysServiceAddress.remove(key);
        });
    }

    ngOnDestroy() {
        this.resetKeys();
    }
}
