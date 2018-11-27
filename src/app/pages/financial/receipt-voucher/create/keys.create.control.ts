import { Injectable, OnDestroy } from '@angular/core';
import { Hotkey } from 'angular2-hotkeys';
import { KeyboardBaseService } from './../../../../shared/helper/keyServiceBase';

@Injectable()
export class InvoiceCreateKeyService extends KeyboardBaseService {
    keyConfig = {
        company_id: {
            element: null,
            focus: true,
            ng_select: true,
        }
    };

    saveKeys() {
        this.keys = this.getKeys();
        this.context.data['tableKey'] = this.context.table.getKeys();
        this.resetKeys();
        this.context.table.resetKeys();
    }

    initKey() {
        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+backspace', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            (document.activeElement as HTMLElement).blur();
            this.context.confirmModal(0);
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA', 'BUTTON'], 'Back'));

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+t', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            this.context.selectTable();
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Select Table'));
        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+y', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            this.context.selectAll();
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Check All'));
        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+del', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            this.context.clearPayment();
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Clear Payment'));

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+a', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            (document.activeElement as HTMLElement).blur();
            this.context.createVoucher(1, 1);
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Save as Draft'));

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+s', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            (document.activeElement as HTMLElement).blur();
            if (!this.context.generalForm.value.electronic) {
                this.context.confirmModal((this.context.data['summary']
                    ? this.context.data['summary'].change > 0 : false && !this.context.generalForm.value.electronic && this.context.generalForm.value.payment_method !== 5) ? 'overpayment' : 2);
            }
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Save & Submit'));

        if (this.context.listMaster['permission'].approve) {
            this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+v', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
                (document.activeElement as HTMLElement).blur();
                if (!this.context.generalForm.value.electronic) {
                    this.context.confirmModal((this.context.data['summary']
                        ? this.context.data['summary'].change > 0 : false && !this.context.generalForm.value.electronic && this.context.generalForm.value.payment_method !== 5) ? 'overpayment-approve' : 3);
                }
                const e: ExtendedKeyboardEvent = event;
                e.returnValue = false; // Prevent bubbling
                return e;
            }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Save & Validate'));
        }

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+c', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            (document.activeElement as HTMLElement).blur();
            this.context.createVoucher(1, 1, 1);
            this.context.resetVoucher();
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Save & Create New'));
    }
}
