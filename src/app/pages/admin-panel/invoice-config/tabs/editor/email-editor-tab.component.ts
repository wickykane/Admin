import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
@Component({
    selector: 'app-tab-email-editor',
    templateUrl: './email-editor-tab.component.html',
    styleUrls: ['./email-editor-tab.component.scss']
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

    constructor() {}

    ngOnInit() {
    }

    ngOnDestroy() {
        this.emailTemplateChange.emit(this.template);
    }

    onSelectField(field) {
        console.log(field);
        this.showContextMenu = false;
        if (this.isFocusingSubject) {
            // this.subjectEditor.instance.insertHtml(field.value);
            this.insertFieldToSubject(field.value);
        }
        if (this.isFocusingBody) {
            this.bodyEditor.instance.insertHtml(field.value);
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
}
