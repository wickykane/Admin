import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';

import { HotkeysService } from 'angular2-hotkeys';
import { EmailTemplateModalContent } from '../../modals/email-template/email-template.modal';
import { EmailTemplateKeyService } from '../../modals/email-template/keys.control';
@Component({
    selector: 'app-tab-email-editor',
    templateUrl: './email-editor-tab.component.html',
    styleUrls: ['./email-editor-tab.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmailEditorTabComponent implements OnInit, OnDestroy {

    @Input() template = {
        email_tpl : {
            subject: '',
            body: ''
        }
    };
    @Input() tags = [];
    @Output() emailTemplateChange = new EventEmitter();
    @ViewChild('subjectEditor') subjectEditor: any;
    @ViewChild('bodyEditor') bodyEditor: any;

    public lastFocusedInput: any;

    public isFocusingSubject = false;
    public isFocusingBody = false;

    public showContextMenu = false;
    public data = {};

    constructor(
        private cd: ChangeDetectorRef,
        private _hotkeysService: HotkeysService,
        public keyService: EmailTemplateKeyService,
        @Inject(EmailTemplateModalContent) private parent: EmailTemplateModalContent) {
        //  Init Key
        if (!this.parent.data['shortcut']) {
            this.keyService.watchContext.next({ context: this, service: this._hotkeysService });
        }
    }

    ngOnInit() {
        this.changeShortcut();
    }

    ngOnDestroy() {
        this.emailTemplateChange.emit(this.template);
    }

    refresh() {
        if (!this.cd['destroyed']) { this.cd.detectChanges(); }
    }

    onSelectField(field) {
        console.log(field);
        this.showContextMenu = false;
        if (this.isFocusingSubject) {
            // this.subjectEditor.instance.insertHtml(field.value);
            this.insertFieldToSubject(field.value);
        }
        if (this.isFocusingBody) {
            // this.bodyEditor.instance.insertHtml(field.value);
            this.bodyEditor.instance.insertHtml('<span class="marker">' + field.value + '</span> ');
        }
    }

    onFocusSubject() {
        this.isFocusingSubject = true;
        this.isFocusingBody = false;
        this.lastFocusedInput = document.activeElement;
    }

    insertFieldToSubject(fieldName) {
        const input = this.lastFocusedInput;

        if (input === undefined) {
            return;
        }

        const scrollPos = input.scrollTop;
        let pos = 0;
        const browser = ((input.selectionStart || input.selectionStart === '0') ? 'ff' : (document['selection'] ? 'ie' : false ) );

        if (browser === 'ie') {
            input.focus();
            const range = document['selection'].createRange();
            range.moveStart ('character', -input.value.length);
            pos = range.text.length;
        } else if (browser === 'ff') {
            pos = input.selectionStart;
        }

        const front = (input.value).substring(0, pos);
        const back = (input.value).substring(pos, input.value.length);
        input.value = front + fieldName + back;
        pos = pos + fieldName.length;

        if (browser === 'ie') {
            input.focus();
            const range = document['selection'].createRange();
            range.moveStart ('character', -input.value.length);
            range.moveStart ('character', pos);
            range.moveEnd ('character', 0);
            range.select();
        } else if (browser === 'ff') {
            input.selectionStart = pos;
            input.selectionEnd = pos;
            input.focus();
        }

        this.template.email_tpl.subject = input.value;
        input.scrollTop = scrollPos;
    }

    changeShortcut() {
        setTimeout(() => {
            this.parent.data['shortcut'] = this.keyService.getKeys();
        });
    }

    clickInsert() {
        this.showContextMenu = !this.showContextMenu;
        this.refresh();
        if (this.keyService.keyConfig.firstField.element) {
            this.keyService.keyConfig.firstField.element.nativeElement.querySelector('label a').focus();
            this.refresh();
        }
    }
}
