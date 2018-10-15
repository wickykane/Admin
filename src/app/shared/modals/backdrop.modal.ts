import { Component, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-backdrop-modal',
    templateUrl: './backdrop.modal.html',
    styleUrls: ['./site.modal.scss']
})
// tslint:disable-next-line:component-class-suffix
export class BackdropModalContent implements OnInit {
    @Input() message;
    @Input() yesButtonText;
    // @Input() noButtonText;
    @ViewChild('okButton') okButton;
    constructor(public activeModal: NgbActiveModal) { }

    ngOnInit() {
        this.okButton.nativeElement.focus();
    }
}
