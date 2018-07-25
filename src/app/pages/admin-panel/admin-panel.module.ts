import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgbAlertModule, NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';

import { ItemModalModule } from '../../shared/modals/item.module';
import { AdminPanelRoutingModule } from './admin-panel-routing.module';
import { AdminPanelComponent } from './admin-panel.component';

import { BankComponent } from './bank/bank.component';
import { BranchComponent } from './bank/branch/branch.component';
import { BankModalComponent } from './bank/modal/bank.modal';
import { BranchModalComponent } from './bank/modal/branch.modal';
import { DiscountCategoryComponent } from './discount-category/discount-category.component';
import { DiscountCategoryCreateComponent } from './discount-category/discount-category.create.component';

import { DiscountCloneComponent } from './discount/discount-clone.component';
import { DiscountCreateComponent } from './discount/discount-create.component';
import { DiscountDetailComponent } from './discount/discount-detail.component';
import { DiscountEditComponent } from './discount/discount-edit.component';
import { DiscountComponent } from './discount/discount.component';
import { PayTermCreateComponent } from './payterm/payterm-create.component';

import { InsuranceBranchComponent } from './insurance-company/branch/branch.component';
import { InsuranceComponent } from './insurance-company/insurance.component';
import { InsuranceBranchModalComponent } from './insurance-company/modal/branch.modal';
import { InsuranceModalComponent } from './insurance-company/modal/insurance.modal';

import { PaymentTermComponent } from './payterm/payterm.component';
import { WarehouseCreateComponent } from './warehouse/warehouse-create.component';
import { WarehouseEditComponent } from './warehouse/warehouse-edit.component';
import { WarehouseComponent } from './warehouse/warehouse.component';

import { ReturnReasonCreateComponent } from './return-reason/return-reason-create.component';
import { ReturnReasonComponent } from './return-reason/return-reason.component';
import { ShipmentMethodComponent } from './shipment-method/shipment-method.component';
import { UnitMeasureComponent } from './unit-measure/unit-measure.component';

import { LateFeePolicyDetailComponent } from './late-fee-policy/late-fee-policy-detail.component';
import { LateFeePolicyComponent } from './late-fee-policy/late-fee-policy.component';
import { CustomerModalContent } from './late-fee-policy/modal/customer.modal';
import { TerminatePolicyModalContent } from './late-fee-policy/modal/terminate-policy.modal';

import { EPIPolicyDetailComponent } from './epi-policy/epi-policy-detail.component';
import { EPIPolicyComponent } from './epi-policy/epi-policy.component';
import { CustomerEPIModalContent } from './epi-policy/modal/customer.modal';
import { TerminateEPIPolicyModalContent } from './epi-policy/modal/terminate-policy.modal';

import { UserModule } from './user/user.module';
import { WorkFlowModule } from './work-flow/work-flow.module';

import { InvoiceConfigComponent } from './invoice-config/invoice-config.component';
import { EmailTemplateModalContent } from './invoice-config/modals/email-template.modal';
import { EmailEditorTab } from './invoice-config/tabs/editor/email-editor-tab.component';
import { EmailPreviewTab } from './invoice-config/tabs/preview/email-preview-tab.component';

import { CommonService, TableService } from '../../services/index';
import {
    CommonShareModule,
    PageHeaderModule,
    StatModule
} from '../../shared/index';

import { AdminPanelService } from './admin-panel.service';

@NgModule({
    imports: [
        CommonModule,
        NgbAlertModule.forRoot(),
        AdminPanelRoutingModule,
        StatModule,
        UserModule,
        PageHeaderModule,
        WorkFlowModule,
        CommonShareModule,
        ItemModalModule
    ],
    declarations: [
        AdminPanelComponent,
        UnitMeasureComponent,
        ShipmentMethodComponent,
        BankComponent,
        BankModalComponent,
        BranchModalComponent,
        BranchComponent,
        PaymentTermComponent,
        WarehouseComponent,
        WarehouseCreateComponent,
        WarehouseEditComponent,
        ReturnReasonComponent,
        DiscountCategoryComponent,
        DiscountCategoryCreateComponent,
        PayTermCreateComponent,
        InsuranceComponent,
        InsuranceBranchComponent,
        InsuranceBranchModalComponent,
        InsuranceModalComponent,
        ReturnReasonCreateComponent,
        DiscountComponent,
        DiscountDetailComponent,
        DiscountCreateComponent,
        DiscountEditComponent,
        DiscountCloneComponent,
        LateFeePolicyDetailComponent,
        LateFeePolicyComponent,
        CustomerModalContent,
        TerminatePolicyModalContent,
        EPIPolicyDetailComponent,
        EPIPolicyComponent,
        CustomerEPIModalContent,
        TerminateEPIPolicyModalContent,
        InvoiceConfigComponent,
        EmailTemplateModalContent,
        EmailEditorTab,
        EmailPreviewTab
    ],
    entryComponents: [
        BankModalComponent,
        BranchModalComponent,
        InsuranceBranchModalComponent,
        InsuranceModalComponent,
        CustomerModalContent,
        TerminatePolicyModalContent,
        CustomerEPIModalContent,
        TerminateEPIPolicyModalContent,
        EmailTemplateModalContent
    ],
    providers: [TableService, CommonService, AdminPanelService]
})
export class AdminPanelModule {}
