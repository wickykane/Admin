import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'item-promotion-content',
    templateUrl: './promotion.modal.html'
})
export class PromotionModalContent implements OnInit {
    @Input() data;
    /**
     * Variable Declaration
     */
    public listPromotion = [];


    constructor(public activeModal: NgbActiveModal) {
    }

    ngOnInit() {
        //  Init Fn
        this.listPromotion = this.data;
    }

    cancel = function() {
        this.activeModal.close();
    };

    ok = function() {
        const checkList = [];
        this.listPromotion.forEach((item) => {
            if (item.is_checked) {
                checkList.push(item.id);
            }
        });
        this.activeModal.close(checkList);
    };

}
