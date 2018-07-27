import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

@Component({
    selector: "tab-email-editor",
    templateUrl: "./email-editor-tab.component.html",
    styleUrls: ["./email-editor-tab.component.scss"]
})
export class EmailEditorTab implements OnInit {

    @Input() template = {};
    @Output() emailTemplateChange = new EventEmitter();

    public showContextMenu = false;
    public listMaster = {
        insertFields: [
            { id: 1, label: "Your Company Name", value: "Your Company Name" },
            { id: 2, label: "Customer Name", value: "Customer Name" },
            { id: 3, label: "Invoice Number", value: "Invoice Number" },
            { id: 4, label: "Invoice Amount", value: "Invoice Amount" },
            { id: 5, label: "Due Date", value: "Due Date" },
            { id: 6, label: "Invoice Date", value: "Invoice Date" },
            { id: 7, label: "Your Company Email", value: "Your Company Email" },
            { id: 8, label: "Your Company Phone", value: "Your Company Phone" },
            { id: 9, label: "Your Company Address", value: "Your Company Address" }
        ]
    };

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
