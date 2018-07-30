import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

@Component({
    selector: "tab-email-editor",
    templateUrl: "./email-editor-tab.component.html",
    styleUrls: ["./email-editor-tab.component.scss"]
})
export class EmailEditorTab implements OnInit {

    @Input() template = {};
    @Input() tags = [];
    @Output() emailTemplateChange = new EventEmitter();

    public showContextMenu = false;

    constructor() {}

    ngOnInit() {
    }

    ngOnDestroy() {
        this.emailTemplateChange.emit(this.template);
    }

    onSelectField(field) {
        this.showContextMenu = false;
    }
}
