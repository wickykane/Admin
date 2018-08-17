import { state } from '@angular/animations';
import { Component, Input, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TableService } from './../../services/table.service';

import { CustomerService } from '../../pages/customer-mgmt/customer.service';
import { ItemService } from './item.service';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../services/common.service';

@Component({
    selector: 'app-state-filter-modal',
    templateUrl: './stateFilter.modal.html',
})
export class StateFilterModalComponent implements OnInit {
    @Input() stateList;
    @Input() code;
    /**
     * Variable Declaration
     */
    generalForm: FormGroup;

    public tempStateList =[];
    public selectAll = false;
    hotkeyCtrlLeft: Hotkey | Hotkey[];
    hotkeyCtrlRight: Hotkey | Hotkey[];
    public stateNameFilter = '';
    constructor(public fb: FormBuilder,
        public router: Router,
        public toastr: ToastrService,
        private itemService: ItemService,
        private customerService: CustomerService,
        private modalService: NgbModal,
        private hotkeysService: HotkeysService,
        private commonService: CommonService,
        public activeModal: NgbActiveModal) {

        this.generalForm = fb.group({
            'parent_company_name': [null],
            'site_code': [null, Validators.required],
            'site_name': [null, Validators.required],
            'registration_no': [null],
            'phone': [''],
            'fax': [''],
            'credit_limit': [null],
            'credit_sts': 2,
            'sale_person_id': [null],
            'payment_make': [null, Validators.required],
            'site_id':[null]
        });



    }

    ngOnInit() {
        if(this.stateList){
            this.unSelectState();
            this.tempStateList = this.stateList.slice(0);
        }
    }

    filterState(key) {
        this.stateList = this.filterbyfieldName(this.tempStateList, 'name', key);
      }
    filterbyfieldName(arr:any[], fieldname:string , value:any):any[]{
        var isSearch = (data:any): boolean => {
          var isAll = false;
          if(typeof data === 'object' && typeof data[fieldname] !== 'undefined'){
            isAll = isSearch(data[fieldname]);
          } else {
            if(typeof value === 'number'){
              isAll = data === value;
            } else {
              isAll = data.toString().match( new RegExp(value, 'i') );
            }
          }
          return isAll;
        };
        return arr.filter(isSearch);
      }
      unSelectState(){
          console.log(this.selectAll);
            this.stateList.forEach(item => {
                return item.selected = false;
            });
          

      }
      selectState(){
        console.log(this.selectAll);
          this.stateList.forEach(item => {
              return item.selected = this.selectAll?false:true;
          });
        

    }








    closeModal(data) {
        this.activeModal.close(data);
    }

    closeX() {
        const data = {};
        this.activeModal.close(data);
    }
    SelectedState(item){
        console.log(item);
    }
    save(){
        this.activeModal.close({'code':this.code,'state':this.stateList});
    }

}
