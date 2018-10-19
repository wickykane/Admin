import { Injectable } from '@angular/core';
import { Hotkey } from 'angular2-hotkeys';
import { KeyboardBaseService } from '../../../../shared/helper/keyServiceBase';
import { Helper } from './../../../../shared/helper/common.helper';
@Injectable()
export class RMACreateKeyService extends KeyboardBaseService {
    keyConfig = {
        company_id: {
            element: null,
            focus: true,
            ng_select: true,
        },
    };

    initKey() {
        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+backspace', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            (document.activeElement as HTMLElement).blur();
            this.context.backList();
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Back'));

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+t', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            this.context.selectTable();
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Select Return Table'));

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+y', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            this.context.selectTable2();
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Select Replace Table'));

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+i', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            (document.activeElement as HTMLInputElement).blur();
            this.keys = this.getKeys();
            this.context.data['tableKey'] = this.context.table2.getKeys();
            this.resetKeys();
            this.context.table2.resetKeys();
            setTimeout(() => {
                this.context.addNewItem();
            });

            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Add Replace Item'));


        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+r', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            (document.activeElement as HTMLInputElement).blur();
            this.keys = this.getKeys();
            this.context.data['tableKey'] = this.context.table.getKeys();
            this.resetKeys();
            this.context.table.resetKeys();
            setTimeout(() => {
                this.context.openModalAddItemsOrder();
            });

            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Add Return Item'));


        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+del', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            const item = this.context.list['replaceItem'][this.context.selectedIndex2];
            this.context.deleteAction(item.sku || item.misc_id, item.item_condition_id);
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Delete Replace Item'));


        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+d', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            const item = this.context.list['returnItem'][this.context.selectedIndex];
            this.context.deleteLineItem(item, this.context.selectedIndex);
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Delete Return Item'));

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+a', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            if (this.context.generalForm.valid) {
                this.context.confirmCreateOrder('NW');
            }
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Save as Draft'));

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+v', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            if (this.context.generalForm.valid) {
                this.context.confirmCreateOrder('AR');
            }
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Save & Send to WH'));

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+s', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            if (this.context.generalForm.valid) {
                this.context.confirmCreateOrder('SB');
            }
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Save & Submit'));

    }
}
