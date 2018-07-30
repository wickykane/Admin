import { Component, OnInit, Input, Output, EventEmitter,ViewChild } from "@angular/core";
@Component({
    selector: "tab-email-editor",
    templateUrl: "./email-editor-tab.component.html",
    styleUrls: ["./email-editor-tab.component.scss"]
})
export class EmailEditorTab implements OnInit {

    @Input() template = {};
    @Input() tags = [];
    @Output() emailTemplateChange = new EventEmitter();
    @ViewChild("subjectEditor") subjectEditor: any;
    @ViewChild("bodyEditor") bodyEditor: any;

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
        this.isFocusingSubject ? this.subjectEditor.instance.insertHtml(field.value) : {};
        this.isFocusingBody ? this.bodyEditor.instance.insertHtml(field.value) : {};
    }
}
