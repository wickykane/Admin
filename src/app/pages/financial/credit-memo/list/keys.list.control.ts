import { Injectable, OnDestroy } from '@angular/core';
import { Hotkey } from 'angular2-hotkeys';
import { KeyboardBaseService } from './../../../../shared/helper/keyServiceBase';
@Injectable()
export class CreditMemoListKeyService extends KeyboardBaseService {

    initKey() {
        this._hotkeysService.add(new Hotkey('f1', (event: KeyboardEvent): any => {
            event.preventDefault();
            this.context.addNewDebitMemo();
            return event;
        }, undefined, 'Create New CR'));
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
            this.context.onSubmitDebitMemo();
            return event;
        }, undefined, 'Submit'));
        this._hotkeysService.add(new Hotkey('f6', (event: KeyboardEvent): any => {
            event.preventDefault();
            this.context.onApproveDebitMemo();
            return event;
        }, undefined, 'Approve'));
        this._hotkeysService.add(new Hotkey('f7', (event: KeyboardEvent): any => {
            event.preventDefault();
            this.context.onCancelDebitMemo();
            return event;
        }, undefined, 'Cancel'));
        this._hotkeysService.add(new Hotkey('f8', (event: KeyboardEvent): any => {
            event.preventDefault();
            this.context.onRejectDebitMemo();
            return event;
        }, undefined, 'Reject'));
    }
}
