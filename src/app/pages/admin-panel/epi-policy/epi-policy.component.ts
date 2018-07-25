import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { routerTransition } from '../../../router.animations';
import { TableService } from '../../../services/index';
import { ConfirmModalContent } from '../../../shared/modals/confirm.modal';
import { EPIPolicyService } from './epi-policy.service';
import { EPIPolicyListKeyService } from './keys.list.control';

@Component({
    selector: 'app-epi-policy',
    providers: [EPIPolicyService, EPIPolicyListKeyService],
    templateUrl: 'epi-policy.component.html',
    animations: [routerTransition()]
})

export class EPIPolicyComponent implements OnInit {
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
        private epiPolicyService: EPIPolicyService,
        public keyService: EPIPolicyListKeyService,
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

        this.epiPolicyService.getListEPIPolicy(params).subscribe(res => {
            try {
                this.list.items = res.data.rows;
                this.tableService.matchPagingOption(res.data);
            } catch (e) {
                console.log(e);
            }
        });
    }

    createEPIPolicy() {
        this.router.navigate(['/admin-panel/epi-policy/create']);
    }

    viewEPIPolicy(id?) {
        if (id) {
            this.router.navigate(['/admin-panel/epi-policy/view', id]);
        } else {
            const selectedPolicyId = this.list.items[this.selectedIndex].id;
            if (selectedPolicyId) {
                this.router.navigate(['/admin-panel/epi-policy/view', selectedPolicyId]);
            }
        }
    }

    editEPIPolicy(id?) {
        if (id) {
            this.router.navigate(['/admin-panel/epi-policy/edit', id]);
        } else {
            const selectedPolicyId = this.list.items[this.selectedIndex].id;
            const selectedPolicyStatus = this.list.items[this.selectedIndex].ac;
            if (selectedPolicyId && selectedPolicyStatus !== 2) {
                this.router.navigate(['/admin-panel/epi-policy/edit', selectedPolicyId]);
            }
        }
    }

    convertStatus(id, key) {
        const stt = this.listMaster[key].find(item => item.id === id);
        return stt.value;
    }

}
