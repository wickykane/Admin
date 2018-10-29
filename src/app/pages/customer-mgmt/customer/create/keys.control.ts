import { Injectable } from '@angular/core';
import { Hotkey } from 'angular2-hotkeys';
import { KeyboardBaseService } from './../../../../shared/helper/keyServiceBase';
@Injectable()
export class CustomerCreateKeyService extends KeyboardBaseService {
    keyConfig = {
        type: {
            element: null,
            focus: true,
        },
        back_button: {
            element: null,
            focus: false,
        }
    };

    initKey() {
        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+backspace', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            this.context.router.navigate(['/customer']);
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Back'));
        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+f1', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            (document.activeElement as HTMLElement).blur();
            if (this.keyConfig.type.element) {
                this.keyConfig.type.element.nativeElement.focus();
            }
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Focus'));

        //#region Address Table
        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+1', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            (document.activeElement as HTMLInputElement).blur();
            if (this.context.addresses.length) {
                if (!this.context.flagAddress) {
                    this.context.flagAddress = true;
                    setTimeout( () => {
                        this.context.selectAddressTable();
                    }, 500);
                } else {
                    this.context.selectAddressTable();
                }
            }
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Select Address Table'));

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+2', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            (document.activeElement as HTMLInputElement).blur();
            this.context.flagAddress = !this.context.flagAddress;
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Expand/Collapse Address Table'));

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+3', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            (document.activeElement as HTMLInputElement).blur();
            if (this.context.flagAddress) {
                this.context.addNewAddress();
            }
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Add new Line Address Table'));
        //#endregion Address Table

        //#region Site Table
        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+4', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            (document.activeElement as HTMLInputElement).blur();
            if (this.context.sites.length && this.context.generalForm.value.buyer_type === 'CP') {
                if (!this.context.flagSite) {
                    this.context.flagSite = true;
                    setTimeout( () => {
                        this.context.selectSiteTable();
                    }, 500);
                } else {
                    this.context.selectSiteTable();
                }
            }
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Select Site Table'));

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+5', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            (document.activeElement as HTMLInputElement).blur();
            if (this.context.generalForm.value.buyer_type === 'CP') {
                this.context.flagSite = !this.context.flagSite;
            }
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Expand/Collapse Site Table'));

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+6', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            (document.activeElement as HTMLInputElement).blur();
            if (this.context.generalForm.value.buyer_type === 'CP' && this.context.flagSite) {
                this.context.addNewSite();
            }
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Add new Line Site Table'));
        //#endregion Site Table

        //#region Contact Table
        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+7', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            (document.activeElement as HTMLInputElement).blur();
            if (this.context.contacts.length && this.context.generalForm.value.buyer_type === 'CP') {
                if (!this.context.flagContact) {
                    this.context.flagContact = true;
                    setTimeout( () => {
                        this.context.selectContactTable();
                    }, 500);
                } else {
                    this.context.selectContactTable();
                }
            }
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Select Contact Table'));

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+8', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            (document.activeElement as HTMLInputElement).blur();
            if (this.context.generalForm.value.buyer_type === 'CP') {
                this.context.flagContact = !this.context.flagContact;
            }
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Expand/Collapse Contact Table'));

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+9', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            (document.activeElement as HTMLInputElement).blur();
            if (this.context.generalForm.value.buyer_type === 'CP' && this.context.flagContact) {
                this.context.addNewContact();
            }
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Add new Line Contact Table'));
        //#endregion Contact Table

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+s', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            (document.activeElement as HTMLElement).blur();
            if (this.context.generalForm.valid) {
                this.context.createCustomer();
            }
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Save'));
    }
}
