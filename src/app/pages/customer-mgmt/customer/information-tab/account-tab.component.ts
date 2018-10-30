import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { TableService } from '../../../../services/table.service';
import { cdArrowTable } from '../../../../shared';
import { Helper } from '../../../../shared/helper/common.helper';
import { CustomerService } from '../../customer.service';


@Component({
    selector: 'app-customer-account-tab',
    templateUrl: './account-tab.component.html',
    styleUrls: ['./information-tab.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerAccountTabComponent implements OnInit, OnDestroy {

    /**
     * letiable Declaration
     */
    @Input() set listData(data) {
        if (data) {
            this.list.accounts = data['bank_accounts'] || [];
            this.list.cards = data['credit_cards'] || [];
        }
    }
    public data = {};
    public list = {
        accounts: [],
        cards: [],
    };
    public selectedIndex = 0;
    public listCreditCard = [];
    @ViewChild(cdArrowTable) table: cdArrowTable;
    constructor(private customerService: CustomerService,
    private cd: ChangeDetectorRef,
    private helper: Helper,
    public tableService: TableService,
    public _hotkeysServiceAccount: HotkeysService) {
        this.initKeyBoard();
    }

    ngOnInit() {
        this.getListCreditCard();
    }

    refresh() {
         if (!this.cd['destroyed']) { this.cd.detectChanges(); }
    }

    getListCreditCard() {
        this.customerService.getCreditCard().subscribe(res => {
            this.listCreditCard = res.data;
            this.refresh();
            // this.credit_cards.forEach(card => { card.listCard = res.data });
        });
    }
    getCardType(id) {
        let name = '';
        this.listCreditCard.forEach(item => {
            if (item.id === id) {
                name = item.name;
            }
        });
        return name;
    }
    selectTable() {
        this.selectedIndex = 0;
        this.table.element.nativeElement.querySelector('td').focus();
    }
    initKeyBoard() {
        this._hotkeysServiceAccount.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+t', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            this.selectTable();
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Select Table'));

        this._hotkeysServiceAccount.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+pageup', (event: KeyboardEvent): boolean => {
            this.tableService.pagination.page--;
            if (this.tableService.pagination.page < 1) {
                this.tableService.pagination.page = 1;
                return;
            }
            this.tableService.changePage(this.tableService.pagination.page);
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Previous page'));

        this._hotkeysServiceAccount.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+pagedown', (event: KeyboardEvent): boolean => {
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
        const keys = Array.from(this._hotkeysServiceAccount.hotkeys);
        keys.map(key => {
            this._hotkeysServiceAccount.remove(key);
        });
    }

    ngOnDestroy() {
        this.resetKeys();
    }
}
