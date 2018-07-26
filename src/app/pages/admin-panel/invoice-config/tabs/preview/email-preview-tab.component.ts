import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

@Component({
    selector: "tab-email-preview",
    templateUrl: "./email-preview-tab.component.html",
    styleUrls: ["./email-preview-tab.component.scss"]
})
export class EmailPreviewTab implements OnInit {
    @Input() emailTemplate: any;

    public subjectContent: any;
    public bodyContent: any;

    constructor() {}

    ngOnInit() {
        this.subjectContent = `<b>#${this.emailTemplate[0].value}</b>
            Invoice <b>#${this.emailTemplate[3].value}</b> is nearing it's due date!`

        this.bodyContent = `
            <table>
                <tr>
                    <td>
                        Dear <b>#${this.emailTemplate[1].value}</b>
                    </td>
                </tr>
                <tr><td><br></td></tr>
                <tr>
                    <td>
                        Our records show that invoice
                        <b>${this.emailTemplate[2].value}</b> for the amount of
                        <b>${this.emailTemplate[3].value}</b> will become past due on
                        <b>${this.emailTemplate[4].value}</b>
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
                        The <b>${this.emailTemplate[0].value}</b> team
                    </td>
                </tr>
            </table>`;
    }
}
