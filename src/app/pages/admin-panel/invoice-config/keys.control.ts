import { Injectable } from '@angular/core';
import { Hotkey } from 'angular2-hotkeys';
import { KeyboardBaseService } from './../../../shared/helper/keyServiceBase';
@Injectable()
export class InvoiceConfigKeyService extends KeyboardBaseService {
    keyConfig = {
        before_edit: {
            element: null,
            focus: false,
        }
    };

    initKey() {
        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+f1', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            (document.activeElement as HTMLElement).blur();
            this.context.applyChaseOption = '1';
            this.context.checkApplyChasing();
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Disable Chasing'));

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+f2', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            (document.activeElement as HTMLElement).blur();
            this.context.applyChaseOption = '2';
            this.context.checkApplyChasing();
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Apply For All Customer'));

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+f3', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            (document.activeElement as HTMLElement).blur();
            this.context.invoiceForm.controls['beforeOn'].setValue(!this.context.invoiceForm.value['beforeOn']);
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Turn On/Off Before Due Date'));

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+f5', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            (document.activeElement as HTMLElement).blur();
            this.context.invoiceForm.controls['onDueDateOn'].setValue(!this.context.invoiceForm.value['onDueDateOn']);
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Turn On/Off On Due Date'));

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+f6', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            (document.activeElement as HTMLElement).blur();
            this.context.invoiceForm.controls['afterDueDateOn'].setValue(!this.context.invoiceForm.value['afterDueDateOn']);
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Turn On/Off After Due Date'));

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+f', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            (document.activeElement as HTMLElement).blur();
            if (this.keyConfig.before_edit.element) {
                this.keyConfig.before_edit.element.nativeElement.focus();
            }
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Focus'));

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+s', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            (document.activeElement as HTMLElement).blur();
            if (!this.context.isProcessingRequest) {
                this.context.onSave();
            }
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Save'));

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+backspace', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            (document.activeElement as HTMLElement).blur();
            this.context.router.navigate(['/admin-panel']);
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Cancel'));
    }
}
