import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { routerTransition } from '../../../router.animations';
import { TableService } from '../../../services/index';
import { ConfirmModalContent } from '../../../shared/modals/confirm.modal';
import { LateFeePolicyKeyService } from './keys.control';
import { LateFeePolicyService } from './late-fee-policy.service';

@Component({
    selector: 'app-late-fee-policy',
    providers: [LateFeePolicyService, LateFeePolicyKeyService],
    templateUrl: 'late-fee-policy.component.html',
    animations: [routerTransition()]
})

export class LateFeePolicyComponent implements OnInit {
    /**
     *  Variable
     */
    public searchForm: FormGroup;
    public listMaster = {};
    public selectedIndex = 0;
    public list = {
        items: []
    };
    public data = {};

    constructor(
        private fb: FormBuilder,
        public tableService: TableService,
        private activeRouter: ActivatedRoute,
        private router: Router,
        private lateFeePolicyService: LateFeePolicyService,
        public keyService: LateFeePolicyKeyService,
        private modalService: NgbModal,
        private toastr: ToastrService) {
        this.searchForm = fb.group({
            'status': [null]
        });

        // Assign get list function name, override variable here
        this.tableService.getListFnName = 'getList';
        this.tableService.context = this;
        this.keyService.watchContext.next(this);
    }

    ngOnInit() {
        this.listMaster['applyFor'] = [
            { id: 1, value: 'All Customers' },
            { id: 2, value: 'Specific Customers' }
        ];
        this.listMaster['status'] = [
            { id: 1, value: 'Active' },
            { id: 0, value: 'Inactive' },
            { id: 2, value: 'Closed' }
        ];
        this.getList();
    }

    /**
     * Table Event
     */

    selectData(index) {
        console.log(index);
    }

    /**
     * Internal Function
     */

    getList() {
        const params = { ...this.tableService.getParams(), ...this.searchForm.value };
        Object.keys(params).forEach((key) => (params[key] === null || params[key] === '') && delete params[key]);

        this.lateFeePolicyService.getListLateFeePolicy(params).subscribe(res => {
            try {
                this.list.items = res.data.rows;
                this.tableService.matchPagingOption(res.data);
            } catch (e) {
                console.log(e);
            }
        });
    }

    createLateFeePolicy() {
        this.router.navigate(['/admin-panel/late-fee-policy/create']);
    }

    viewLateFeePolicy(id) {
        this.router.navigate(['/admin-panel/late-fee-policy/view', id]);
    }

    editLateFeePolicy(id) {
        this.router.navigate(['/admin-panel/late-fee-policy/edit', id]);
    }

    convertStatus(id, key) {
        const stt = this.listMaster[key].find(item => item.id === id);
        return stt.value;
    }

}
