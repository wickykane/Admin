import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

@Component({
    selector: "tab-email-preview",
    templateUrl: "./email-preview-tab.component.html",
    styleUrls: ["./email-preview-tab.component.scss"]
})
export class EmailPreviewTab implements OnInit {
    @Input() template: any;
    @Input() tags = [];
    public displayTemplate: any;

    constructor() {}

    ngOnInit() {
        this.displayTemplate = Object.assign({}, this.template);
        this.tags.forEach(field => {
            this.displayTemplate.subject = this.displayTemplate.subject.replace(field.tag, field.value);
            this.displayTemplate.body = this.displayTemplate.body.replace(field.tag, field.value);
        });
    }

}
