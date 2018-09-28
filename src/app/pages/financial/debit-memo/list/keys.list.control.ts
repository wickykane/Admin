import { Injectable, OnDestroy } from '@angular/core';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { KeyboardBaseService } from './../../../../shared/helper/keyServiceBase';
@Injectable()
export class DebitMemoListKeyService extends KeyboardBaseService  {
    initKey() {
        this._hotkeysService.add(new Hotkey('f1', (event: KeyboardEvent): any => {
            event.preventDefault();
            this.context.addNewDebitMemo();
            return event;
        }, undefined, 'Create New DR'));
        this._hotkeysService.add(new Hotkey('f2', (event: KeyboardEvent): any => {
            event.preventDefault();
            this.context.onStartSearch();
            return event;
        }, undefined, 'Start Search'));
        this._hotkeysService.add(new Hotkey('f3', (event: KeyboardEvent): any => {
            event.preventDefault();
            this.context.tableService.searchAction();
            event.returnValue = false;
            return event;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Execute Search'));
        this._hotkeysService.add(new Hotkey('f4', (event: KeyboardEvent): any => {
            event.preventDefault();
            this.context.tableService.resetAction(this.context.searchForm);
            event.returnValue = false;
            return event;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Reset Search'));
        this._hotkeysService.add(new Hotkey('f5', (event: KeyboardEvent): any => {
            event.preventDefault();
            if (this.context.listDebitMemo.length) {
                this.context.onChangeDebitStatus(this.context.listDebitMemo[this.context.selectedIndex]['id'], 2);
            }
            return event;
        }, undefined, 'Submit'));
        this._hotkeysService.add(new Hotkey('f6', (event: KeyboardEvent): any => {
            event.preventDefault();
            if (this.context.listDebitMemo.length) {
                this.context.onChangeDebitStatus(this.context.listDebitMemo[this.context.selectedIndex]['id'], 3);
            }
            return event;
        }, undefined, 'Approve'));
        this._hotkeysService.add(new Hotkey('f7', (event: KeyboardEvent): any => {
            event.preventDefault();
            if (this.context.listDebitMemo.length) {
                this.context.onChangeDebitStatus(this.context.listDebitMemo[this.context.selectedIndex]['id'], 5);
            }
            return event;
        }, undefined, 'Cancel'));
        this._hotkeysService.add(new Hotkey('f8', (event: KeyboardEvent): any => {
            event.preventDefault();
            if (this.context.listDebitMemo.length) {
                this.context.onChangeDebitStatus(this.context.listDebitMemo[this.context.selectedIndex]['id'], 4);
            }
            return event;
        }, undefined, 'Reject'));
        this._hotkeysService.add(new Hotkey('f9', (event: KeyboardEvent): any => {
            event.preventDefault();
            if (this.context.listDebitMemo.length) {
                this.context.onChangeDebitStatus(this.context.listDebitMemo[this.context.selectedIndex]['id'], 1);
            }
            return event;
        }, undefined, 'Re-open'));
        this._hotkeysService.add(new Hotkey('f10', (event: KeyboardEvent): any => {
            event.preventDefault();
            if (this.context.listDebitMemo.length) {
                this.context.onViewDebitMemo(this.context.listDebitMemo[this.context.selectedIndex]['id']);
            }
            return event;
        }, undefined, 'View'));
    }
}
