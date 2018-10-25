import { Injectable } from '@angular/core';
import { Hotkey } from 'angular2-hotkeys';
import { KeyboardBaseService } from './../../../../../shared/helper/keyServiceBase';

@Injectable()
export class EmailTemplateKeyService extends KeyboardBaseService {

    keyConfig = {
        subject: {
            element: null,
            focus: false,
        },
        body: {
            element: null,
            focus: false,
        },
        insert: {
            element: null,
            focus: false
        }
    };

    saveKeys() {
        this.keys = this.getKeys();
        this.resetKeys();
    }

    initKey() {
        this._hotkeysService.add(new Hotkey('alt+backspace', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            this.context.parent.activeModal.dismiss();
            return;
        }, undefined, 'Back'));

        this._hotkeysService.add(new Hotkey('alt+i', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            if (this.keyConfig.insert.element) {
                this.keyConfig.insert.element.nativeElement.focus();
            }
            return;
        }, undefined, 'Insert Field'));

        this._hotkeysService.add(new Hotkey('alt+s', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            this.context.parent.saveTemplate();
            return;
        }, undefined, 'Save'));

        this._hotkeysService.add(new Hotkey('alt+e', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            this.context.parent.sendSampleEmail();
            return;
        }, undefined, 'Send Sample'));

        this._hotkeysService.add(new Hotkey('alt+f', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            if (this.keyConfig.subject.element) {
                this.keyConfig.subject.element.nativeElement.focus();
            }
            return;
        }, undefined, 'Focus'));

        this._hotkeysService.add(new Hotkey('alt+pagedown', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            this.context.parent.selectTab('preview');
            return;
        }, undefined, 'Next Tab'));

        this._hotkeysService.add(new Hotkey('alt+pageup', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            this.context.parent.selectTab('edit');
            return;
        }, undefined, 'Prev Tab'));
    }
}
