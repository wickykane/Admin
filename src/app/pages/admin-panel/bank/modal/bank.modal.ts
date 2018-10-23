import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BankService } from '../bank.service';

import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { Helper } from '../../../../shared/helper/common.helper';
@Component({
  selector: 'app-bank-modal',
  templateUrl: './bank.modal.html',
  providers: [BankService, HotkeysService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BankModalComponent implements OnInit, OnDestroy {
    // Resolve Data
    public bankForm: FormGroup;
    @Input() item;
    @Input() modalTitle;
    @Input() isEdit;
    public data = {};

    constructor(public activeModal: NgbActiveModal, private fb: FormBuilder, private bankService: BankService,
        private cd: ChangeDetectorRef,
        private helper: Helper,
        public _hotkeysService: HotkeysService) {
        this.bankForm = fb.group({
        'code': [{ value: null, disabled: true }],
        'name': [null, Validators.required],
        'swift': [null, Validators.required],
        });
    }

    ngOnInit() {
        if (this.item.id) {
        this.getDetailBank(this.item.id);
        }
        this.initKeyBoard();
    }

    refresh() {
        if (!this.cd['destroyed']) { this.cd.detectChanges(); }
    }

    getDetailBank(id) {
        this.bankService.getDetailBank(id).subscribe((res) => {
        this.bankForm.patchValue(res.data);
        this.refresh();
        });
    }

    ok() {
        this.activeModal.close(this.bankForm.value);
    }

    cancel() {
        this.activeModal.dismiss();
    }

    initKeyBoard() {
        this.data['key_config'] = {
            name: {
                element: null,
                focus: true,
            },
        };

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+f1', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            event.preventDefault();
            if (this.data['key_config'].name.element) {
                this.data['key_config'].name.element.nativeElement.focus();
            }
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Focus'));

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+o', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            this.ok();
            const e: ExtendedKeyboardEvent = event;
            e.returnValue = false; // Prevent bubbling
            return e;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'OK'));

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+backspace', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
            event.preventDefault();
            this.cancel();
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
