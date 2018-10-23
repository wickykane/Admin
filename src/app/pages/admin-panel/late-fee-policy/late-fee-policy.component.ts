import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { routerTransition } from '../../../router.animations';
import { TableService } from '../../../services/index';
import { cdArrowTable } from '../../../shared';
import { LateFeePolicyListKeyService } from './keys.list.control';
import { LateFeePolicyService } from './late-fee-policy.service';

@Component({
    selector: 'app-late-fee-policy',
    providers: [LateFeePolicyService, LateFeePolicyListKeyService],
    templateUrl: 'late-fee-policy.component.html',
    styleUrls: ['./late-fee-policy.component.scss'],
    animations: [routerTransition()],
    changeDetection: ChangeDetectionStrategy.OnPush
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
    @ViewChild(cdArrowTable) table: cdArrowTable;
    constructor(
        private cd: ChangeDetectorRef,
        private fb: FormBuilder,
        public tableService: TableService,
        private activeRouter: ActivatedRoute,
        private router: Router,
        private lateFeePolicyService: LateFeePolicyService,
        public keyService: LateFeePolicyListKeyService,
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
    refresh() {
         if (!this.cd['destroyed']) { this.cd.detectChanges(); }
    }

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
                this.refresh();
            } catch (e) {
                console.log(e);
            }
        });
    }

    createLateFeePolicy() {
        this.router.navigate(['/admin-panel/late-fee-policy/create']);
    }

    viewLateFeePolicy(id?) {
        if (id) {
            this.router.navigate(['/admin-panel/late-fee-policy/view', id]);
        } else {
            const selectedPolicyId = this.list.items[this.selectedIndex].id;
            if (selectedPolicyId) {
                this.router.navigate(['/admin-panel/late-fee-policy/view', selectedPolicyId]);
            }
        }
    }

    editLateFeePolicy(id?) {
        if (id) {
            this.router.navigate(['/admin-panel/late-fee-policy/edit', id]);
        } else {
            const selectedPolicyId = this.list.items[this.selectedIndex].id;
            const selectedPolicyStatus = this.list.items[this.selectedIndex].ac;
            if (selectedPolicyId && selectedPolicyStatus !== 2) {
                this.router.navigate(['/admin-panel/late-fee-policy/edit', selectedPolicyId]);
            }
        }
    }

    convertStatus(id, key) {
        const stt = this.listMaster[key].find(item => item.id === id);
        return stt.value;
    }
    selectTable() {
        this.selectedIndex = 0;
        this.table.element.nativeElement.querySelector('td a').focus();
    }

}
