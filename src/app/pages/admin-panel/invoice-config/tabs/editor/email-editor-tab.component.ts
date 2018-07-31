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
        if (this.isFocusingSubject) { this.subjectEditor.instance.insertHtml(field.value); }
        if (this.isFocusingBody) { this.bodyEditor.instance.insertHtml(field.value); }
    }
}
