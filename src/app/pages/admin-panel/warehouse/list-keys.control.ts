import { Injectable, OnDestroy } from '@angular/core';
import { Hotkey } from 'angular2-hotkeys';
import { KeyboardBaseService } from './../../../shared/helper/keyServiceBase';
@Injectable()
export class WarehouseListKeyService extends KeyboardBaseService {

    initKey() {
        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+v', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            const item = this.context.list.items[this.context.selectedIndex];
            this.context.router.navigate(['/admin-panel/warehouse/edit/', item.id]);
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'View'));

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+pageup', (event: KeyboardEvent): boolean => {
            this.context.tableService.pagination.page--;
            if (this.context.tableService.pagination.page < 1) {
                this.context.tableService.pagination.page = 1;
                return;
            }
            this.context.tableService.changePage(this.context.tableService.pagination.page);
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Previous page'));

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+pagedown', (event: KeyboardEvent): boolean => {
            this.context.tableService.pagination.page++;
            if (this.context.tableService.pagination.page > this.context.tableService.pagination.total_page) {
                this.context.tableService.pagination.page = this.context.tableService.pagination.total_page;
                return;
            }
            this.context.tableService.changePage(this.context.tableService.pagination.page);
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Next page'));

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+t', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            this.context.selectTable();
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Select Table'));
    }
}
