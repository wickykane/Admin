import { Injectable } from '@angular/core';
import { Hotkey } from 'angular2-hotkeys';
import { KeyboardBaseService } from './../../../../shared/helper/keyServiceBase';
@Injectable()
export class CarrierCreateKeyService extends KeyboardBaseService {
    keyConfig = {
        name: {
            element: null,
            focus: false,
        },
        primary_email: {
            element: null,
            focus: false,
        },
        billing_email: {
            element: null,
            focus: false,
        },
        back_button: {
            element: null,
            focus: true,
        }
    };

    initKey() {
        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+backspace', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            (document.activeElement as HTMLElement).blur();
            this.context.router.navigate(['/admin-panel/carrier']);
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Back'));
        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+f1', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            (document.activeElement as HTMLElement).blur();
            if (this.keyConfig.name.element) {
                this.keyConfig.name.element.nativeElement.focus();
            }
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Focus General'));

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+f2', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            (document.activeElement as HTMLElement).blur();
            if (this.keyConfig.primary_email.element) {
                this.keyConfig.primary_email.element.nativeElement.focus();
            }
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Focus Primary'));

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+f3', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            (document.activeElement as HTMLElement).blur();
            if (this.keyConfig.billing_email.element) {
                this.keyConfig.billing_email.element.nativeElement.focus();
            }
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Focus Billing'));

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+t', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            if (this.context.listBankAccount.length) {
                this.context.selectTable();
            }
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Select Table'));

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+i', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            (document.activeElement as HTMLInputElement).blur();
            this.context.addNewBank();
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Add new Line'));

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+del', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            const item = this.context.listBankAccount[this.context.selectedIndex];
            if (item) {
                this.context.removeBankAccount(this.context.selectedIndex, item);
            }
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Delete Item'));

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+s', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            (document.activeElement as HTMLElement).blur();
            if (this.context.valid()) {
                this.context.confirm();
            }
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Save'));

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+c', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            this.context.copyAddress();
            if (this.keyConfig.billing_email.element) {
                this.keyConfig.billing_email.element.nativeElement.focus();
            }
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Copy to Billing Address'));
    }
}
