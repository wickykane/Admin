import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { Helper } from '../../../../../shared/helper/common.helper';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-send-sample-modal-content',
    templateUrl: './send-sample.modal.html',
    styleUrls: ['./send-sample.modal.scss'],
    providers: [HotkeysService]
})
// tslint:disable-next-line:component-class-suffix
export class SendSampleModalContent implements OnInit, OnDestroy {

    public receiverEmail = '';
    public data = {};

    constructor(public activeModal: NgbActiveModal,
        private helper: Helper,
        public _hotkeysService: HotkeysService,
        private toastr: ToastrService) {}

    ngOnInit() {
        this.initKeyBoard();
    }

    onSendSample() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(this.receiverEmail)) {
            this.activeModal.close({
                receiver: this.receiverEmail
            });
        } else {
            this.receiverEmail ? this.toastr.error('Email is invalid!') : this.toastr.error('Email is empty!');
        }
    }

    // Keyboard

    initKeyBoard() {
        this.data['key_config'] = {
            mail: {
                element: null,
                focus: true,
            },
        };

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+f', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            event.preventDefault();
            if (this.data['key_config'].mail.element) {
                this.data['key_config'].mail.element.nativeElement.focus();
            }
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Focus'));

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+s', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            event.preventDefault();
            this.onSendSample();
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Send'));

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+backspace', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            event.preventDefault();
            this.activeModal.dismiss();
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Cancel'));
    }

    resetKeys() {
        const keys = Array.from(this._hotkeysService.hotkeys);
        keys.map(key => {
            this._hotkeysService.remove(key);
        });
    }

    ngOnDestroy() {
        this.resetKeys();
    }
}
