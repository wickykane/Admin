import { Injectable } from '@angular/core';
import { Hotkey } from 'angular2-hotkeys';
import { KeyboardBaseService } from '../../../shared/helper/keyServiceBase';
import { Helper } from './../../../shared/helper/common.helper';


@Injectable()
export class MiscellaneousItemsKeyService extends KeyboardBaseService {
  keyConfig = {
      no: {
          element: null,
          focus: true,
      }
  };

  initKey() {
      this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+f', (event: KeyboardEvent): boolean => {
          event.preventDefault();
          if (this.keyConfig.no.element) {
              this.keyConfig.no.element.nativeElement.focus();
          }
          return;
      }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Focus Search'));

      if (this.context.listMaster['permission'].create) {
        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+n', (event: KeyboardEvent): boolean => {
          event.preventDefault();
          this.context.openModal(true, false);
          return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Create Miscellaneous'));
      }

      this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+e', (event: KeyboardEvent): boolean => {
          event.preventDefault();
          this.context.tableService.searchAction();
          return;
      }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Search'));

      this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+r', (event: KeyboardEvent): boolean => {
          event.preventDefault();
          this.context.tableService.resetAction(this.context.searchForm);
          return;
      }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Reset'));

      if (this.context.listMaster['permission'].view) {
        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+v', (event: KeyboardEvent): boolean => {
          event.preventDefault();
          const item = this.context.list['items'][this.context.selectedIndex];
          this.context.openModal(false, true, item);
          return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'View'));
      }

      if (this.context.listMaster['permission'].edit) {
        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+e', (event: KeyboardEvent): boolean => {
          event.preventDefault();
          const item = this.context.list['items'][this.context.selectedIndex];
          this.context.openModal(false, false, item);
          return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Edit'));
      }

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
