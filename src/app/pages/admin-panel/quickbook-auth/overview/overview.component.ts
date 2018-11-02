import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HotkeysService } from 'angular2-hotkeys';
import { ToastrService } from 'ngx-toastr';
import { routerTransition } from '../../../../router.animations';

import { StorageService } from '../../../../services/storage.service';
import { QuickbookService } from '../quickbook.service';
import { QuickbookKeyService } from './keys.control';

@Component({
    selector: 'app-quickbook-overview',
    templateUrl: './overview.component.html',
    styleUrls: ['./overview.component.scss'],
    animations: [routerTransition()],
    providers: [QuickbookService, QuickbookKeyService]
})
export class QuickbookOverviewComponent implements OnInit {

    public overviewContent = `SEL2B acts as the control dashboard - your business activity on SEL2B gets pushed to QuickBooks Online
    as accounting data. As you create and manage orders, invoices, shipments, returns, credit memo and debit memo, your respective accounts
    on QuickBooks Online will be update with the right amounts, as follows:`;

    public transactionTypes = [];

    public authorInfo = {
        code: null,
        realm_id: null
    };

    public settingInfo = {
        auth_url: '',
        state: ''
    };
    public listMaster = {};

    constructor(
        public router: Router,
        private route: ActivatedRoute,
        public toastr: ToastrService,
        public ngbModal: NgbModal,
        private _hotkeysService: HotkeysService,
        public keyService: QuickbookKeyService,
        public quickbookService: QuickbookService,
        private storage: StorageService
    ) {
        this.transactionTypes = [
            { type: 'Invoice', time: 'Immediate'},
            { type: 'Receipt Voucher', time: 'Immediate'},
            { type: 'Refund Voucher', time: 'Immediate'},
            { type: 'Credit Memo', time: 'Immediate'},
            { type: 'Debit Memo', time: 'Immediate'},
            { type: 'Inventory', time: 'Daily'},
        ];
    }

    ngOnInit() {
        this.listMaster['permission'] = this.storage.getRoutePermission(this.router.url);
        this.getSettingInfo();
        this.authorInfo = {
            code: this.route.snapshot.queryParams['code'],
            realm_id: this.route.snapshot.queryParams['realmId']
        };
        if (this.authorInfo.code && this.authorInfo.realm_id) {
            this.sendInfo();
        }
    }

    getSettingInfo() {
        this.quickbookService.getSettingInfoQuickbook().subscribe(
            res => {
                this.settingInfo = res.data;
                this.keyService.watchContext.next({ context: this, service: this._hotkeysService });
            }, err => {}
        );
    }

    sendInfo() {
        this.quickbookService.sendLoginQuickbookInfo(this.authorInfo).subscribe(
            res => {
                this.getSettingInfo();
            }, err => {}
        );
    }

    onClickInstall() {
        const newWindow = window.open(this.settingInfo.auth_url);
        newWindow.focus();
    }

    onClickUninstall() {
        this.quickbookService.uninstallQuickbook(this.authorInfo).subscribe(
            res => {
                window.location.replace(location.pathname);
                // this.getSettingInfo();
            }, err => {}
        );
    }


}
