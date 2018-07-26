import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

@Component({
    selector: "tab-email-editor",
    templateUrl: "./email-editor-tab.component.html",
    styleUrls: ["./email-editor-tab.component.scss"]
})
export class EmailEditorTab implements OnInit {

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
    public subjectContent = `<b>#${this.listMaster.insertFields[0].value}</b>
            Invoice <b>#${this.listMaster.insertFields[3].value}</b> is nearing it's due date!`

    public bodyContent = `
        <table>
            <tr>
                <td>
                    Dear <b>#${this.listMaster.insertFields[1].value}</b>
                </td>
            </tr>
            <tr><td><br></td></tr>
            <tr>
                <td>
                    Our records show that invoice
                    <b>${this.listMaster.insertFields[2].value}</b> for the amount of
                    <b>${this.listMaster.insertFields[3].value}</b> will become past due on
                    <b>${this.listMaster.insertFields[4].value}</b>
                </td>
            </tr>
            <tr><td><br><br></td></tr>
            <tr>
                <td>
                    This is just a friendly reminder to please make payment as son as possible to avoid late fee charges. We have attached a
                    copy of the invoice for for convenience.
                </td>
            </tr>
            <tr><td><br><br></td></tr>
            <tr>
                <td>
                    We appreciate your business and prompt payment
                </td>
            </tr>
            <tr><td><br></td></tr>
             <tr>
                <td>
                    Thanks you
                </td>
            </tr>
            <tr><td><br></td></tr>
            <tr>
                <td>
                    The <b>${this.listMaster.insertFields[0].value}</b> team
                </td>
            </tr>
        </table>`;

    constructor() {}

    ngOnInit() {
    }

    ngOnDestroy() {
        let emailTemplateField = this.listMaster.insertFields;
        this.emailTemplateChange.emit(emailTemplateField);
    }

    onSelectField(field) {
        this.showContextMenu = false;
    }
}
