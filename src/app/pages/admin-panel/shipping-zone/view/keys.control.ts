import { Injectable, OnDestroy } from '@angular/core';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { KeyboardBaseService } from './../../../../shared/helper/keyServiceBase';
@Injectable()
export class ShippingZoneViewKeyService extends KeyboardBaseService {
    keyConfig = {
        name: {
            element: null,
            focus: true,
        },
        filter: {
            element: null,
            focus: true,
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
            this.context.back();
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Back'));
        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+t', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            this.context.selectTable();
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Select Table'));
        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+v', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            event.preventDefault();
            if (!this.context.checkTable) {
                if (this.context.table.element.nativeElement.querySelectorAll('.row-selected button')) {
                    this.context.table.element.nativeElement.querySelectorAll('.row-selected button')[0].click();
                }
            } else {
                if (this.context.table.element.nativeElement.nextElementSibling.querySelectorAll('.row-selected button')) {
                    this.context.table.element.nativeElement.nextElementSibling.querySelectorAll('.row-selected button')[0].click();
                }
            }
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'View'));
        this._hotkeysService.add(new Hotkey('down', (event: KeyboardEvent): boolean => {
            if (this.context.listShipping[0].data.length === (this.context.selectedIndex[0] + 1)) {
                this.context.selectedIndex[0] = undefined;
                this.context.selectedIndex[1] = -1;
                this.context.checkTable = true;
                this.context.cdr.detectChanges();
            }
            return;
        }, undefined, 'Down'));
        this._hotkeysService.add(new Hotkey('up', (event: KeyboardEvent): boolean => {
            if (this.context.selectedIndex[1] === 0) {
                this.context.selectedIndex[0] = this.context.listShipping[0].data.length;
                this.context.selectedIndex[1] = undefined;
                this.context.checkTable = false;
                this.context.cdr.detectChanges();
            }
            return;
        }, undefined, 'Up'));
    }
}
