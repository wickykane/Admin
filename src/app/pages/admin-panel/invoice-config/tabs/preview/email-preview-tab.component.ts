import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

@Component({
    selector: "tab-email-preview",
    templateUrl: "./email-preview-tab.component.html",
    styleUrls: ["./email-preview-tab.component.scss"]
})
export class EmailPreviewTab implements OnInit {
    @Input() template: any;
    public displayTemplate: any;

    public listMaster = {
        insertFields: [
            { value: "{@@your_company_name@@}", label: "%%YOURCOMPANYNAME%%" },
            { value: "{@@customer_name@@}", label: "%%CUSTOMERNAME%%" },
            { value: "{@@invoice_number@@}", label: "%%INVOICENUMBER%%" },
            { value: "{@@invoice_amount@@}", label: "%%INVOICEAMOUNT%%" },
            { value: "{@@due_date@@}", label: "%%DUEDATE%%" },
            { value: "{@@invoice_date@@}", label: "%%INVOICEDATE%%" },
            { value: "{@@your_company_email@@}", label: "%%YOURCOMPANYEMAIL%%" },
            { value: "{@@your_company_phone@@}", label: "%%YOURCOMPANYPHONE%%" },
            { value: "{@@your_company_address@@}", label: "%%YOURCOMPANYADDRESS%%" },
        ]
    };

    constructor() {}

    ngOnInit() {
        this.displayTemplate = Object.assign({}, this.template);
        this.listMaster.insertFields.forEach(field => {
            this.displayTemplate.email_tpl.subject = this.template.email_tpl.subject.replace(field.value, field.label);
            this.displayTemplate.email_tpl.body = this.template.email_tpl.body.replace(field.value, field.label);
        });
    }

}
