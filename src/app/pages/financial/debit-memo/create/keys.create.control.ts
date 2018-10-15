import { Injectable, OnDestroy } from '@angular/core';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { KeyboardBaseService } from './../../../../shared/helper/keyServiceBase';

@Injectable()
export class DebitMemoCreateKeyService extends KeyboardBaseService {

    keyConfig = {
        company_id: {
            element: null,
            ng_select: true,
        },
        contact_user_id: {
            element: null,
        },
        customer_po: {
            element: null,
        },
        type: {
            element: null,
        },
    };

    initKey() {
        this._hotkeysService.add(new Hotkey('f1', (event: KeyboardEvent): any => {
            event.preventDefault();
            this.context.onClickSave('draft');
            return event;
        }, undefined, 'Save as Draft'));
        this._hotkeysService.add(new Hotkey('f2', (event: KeyboardEvent): any => {
            event.preventDefault();
            this.context.onClickSave('submit');
            return event;
        }, undefined, 'Save & Submit'));
        if (this.context.debitId === null || this.context.debitId === undefined) {
            this._hotkeysService.add(new Hotkey('f3', (event: KeyboardEvent): any => {
                event.preventDefault();
                this.context.onClickSave('create');
                return event;
            }, undefined, 'Save & Create New'));
            this._hotkeysService.add(new Hotkey('f6', (event: KeyboardEvent): any => {
                event.preventDefault();
                return event;
            }, undefined, 'Cancel'));
        }
        this._hotkeysService.add(new Hotkey('f7', (event: KeyboardEvent): any => {
            event.preventDefault();
            this.context.onAddNote();
            return event;
        }, undefined, 'Add Note'));
    }
}
