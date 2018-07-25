import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

@Component({
    selector: "tab-email-editor",
    templateUrl: "./email-editor-tab.component.html",
    styleUrls: ["./email-editor-tab.component.scss"]
})
export class EmailEditorTab implements OnInit {
    public showContextMenu = false;
    public listMaster = {
        insertFields: [
            { value: 1, label: "Your Company Name" },
            { value: 2, label: "Customer Name" },
            { value: 3, label: "Invoice Number" },
            { value: 4, label: "Invoice Amount" },
            { value: 5, label: "Due Date" },
            { value: 6, label: "Invoice Date" },
            { value: 7, label: "Your Company Email" },
            { value: 8, label: "Your Company Phone" },
            { value: 9, label: "Your Company Address" }
        ]
    };

    constructor() {}

    ngOnInit() {}

    onSelectField(field) {
        console.log(field.label);
        this.showContextMenu = false;
    }
}
