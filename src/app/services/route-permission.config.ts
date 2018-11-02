export const ROUTE_PERMISSION = {
    // Customer Management
    'customer': {
        view: 'sel2bViewCustomer',
        create: 'sel2bCreateCustomer',
        edit: 'sel2bEditCustomer',
        list: 'sel2bViewMenuCustomer',
    },
    // Product Management
    'part-list': {
        view: 'sel2bViewPartManagement',
        edit: 'sel2bEditPartManagement',
        list: 'sel2bViewMenuPartManagement',
    },
    'miscellaneous-list': {
        view: 'sel2bViewMiscellaneousItem',
        edit: 'sel2bEditMiscellaneousItem',
        create: 'sel2bCreateMiscellaneousItem',
        delete: 'sel2bDeleteMiscellaneousItem',
        list: 'sel2bViewMenuMiscellaneousItem',
    },
    'item-list': {
        view: 'sel2bViewInventory',
        list: 'sel2bViewMenuInventory',
    },

    // Sales Management
    'sale-quotation': {
        view: 'sel2bViewSaleQuotation',
        edit: 'sel2bEditSaleQuotation',
        create: 'sel2bCreateSaleQuotation',
        copy: 'sel2bCreateSaleQuotation',
        convert: 'sel2bConvertSaleQuotationToSaleOrder',
        submit: 'sel2bSubmitSaleQuotation',
        approve: 'sel2bAcceptRejectSaleQuotation',
        reject: 'sel2bAcceptRejectSaleQuotation',
        cancel: 'sel2bCancelSaleQuotation',
        list: 'sel2bViewMenuSaleQuotation',

    },
    'sale-order': {
        view: 'sel2bViewSaleOrder',
        edit: 'sel2bEditSaleOrder',
        create: 'sel2bCreateSaleOrder',
        copy: 'sel2bCreateSaleOrder',
        submit: 'sel2bSubmitSaleOrder',
        approve: 'sel2bAcceptRejectSaleOrder',
        reject: 'sel2bAcceptRejectSaleOrder',
        cancel: 'sel2bCancelSaleOrder',
        reopen: 'sel2bReopenSaleOrder',
        genInvoice: 'sel2bCreateARInvoice',
        list: 'sel2bViewMenuSaleOrder',
    },
    'return-order': {
        view: 'sel2bViewReturnOrder',
        edit: 'sel2bEditReturnOrder',
        create: 'sel2bCreateReturnOrder',
        cancel: 'sel2bCancelReturnOrder',
        send: 'sel2bSendReturnOrderToWarehouse',
        complete: 'sel2bCompleteReturnOrder',
        list: 'sel2bViewMenuReturnOrder',
    },
    // Financial
    'invoice': {
        view: 'sel2bViewARInvoice',
        print: 'sel2bPrintARInvoice',
        edit: 'sel2bEditARInvoice',
        create: 'sel2bCreateARInvoice',
        submit: 'sel2bSubmitARInvoice',
        approve: 'sel2bAcceptRejectARInvoice',
        reject: 'sel2bAcceptRejectARInvoice',
        cancel: 'sel2bCancelARInvoice',
        mail: 'sel2bSendMailARInvoice',
        revise: 'sel2bReviseARInvoice',
        pay: 'sel2bPayARInvoice',
        updatePOD: 'sel2bUpdatePODSignoffDateARInvoice',
        list: 'sel2bViewMenuARInvoice',
    },
    'receipt-voucher': {
        view: 'sel2bViewReceiptVoucher',
        edit: 'sel2bEditReceiptVoucher',
        create: 'sel2bCreateReceiptVoucher',
        submit: 'sel2bSubmitReceiptVoucher',
        approve: 'sel2bApproveRejectReceiptVoucher',
        reject: 'sel2bApproveRejectReceiptVoucher',
        cancel: 'sel2bCancelReceiptVoucher',
        list: 'sel2bViewMenuReceiptVoucher',
    },
    'credit-memo': {
        view: 'sel2bViewCreditMemo',
        print: 'sel2bPrintCreditMemo',
        edit: 'sel2bEditCreditMemo',
        create: 'sel2bCreateCreditMemo',
        submit: 'sel2bSubmitCreditMemo',
        approve: 'sel2bApproveRejectCreditMemo',
        reject: 'sel2bApproveRejectCreditMemo',
        cancel: 'sel2bCancelCreditMemo',
        apply: 'sel2bApplyCreditMemoToInvoice',
        reopen: 'sel2bReopenCreditMemo',
        mail: 'sel2bSendCreditMemoToEmail',
        pay: 'sel2bPayCreditMemo',
        list: 'sel2bViewMenuCreditMemo',
    },
    'debit-memo': {
        view: 'sel2bViewDebitMemo',
        print: 'sel2bPrintDebitMemo',
        edit: 'sel2bEditDebitMemo',
        create: 'sel2bCreateDebitMemo',
        submit: 'sel2bSubmitDebitMemo',
        approve: 'sel2bApproveRejectDebitMemo',
        reject: 'sel2bApproveRejectDebitMemo',
        cancel: 'sel2bCancelDebitMemo',
        reopen: 'sel2bReopenDebitMemo',
        mail: 'sel2bSendDebitMemoToEmail',
        pay: 'sel2bReceivePaymentDebitMemo',
        list: 'sel2bViewMenuDebitMemo',

    },
    // Admin Panel
    'warehouse': {
        view: 'sel2bViewWarehouse',
        ship: 'sel2bSetUnsetShippingOriginWarehouse',
        enable: 'sel2bActiveInactiveWarehouse',
        list: 'sel2bViewMenuWarehouse',
    },
    'carrier': {
        view: 'sel2bViewCarrier',
        edit: 'sel2bEditCarrier',
        create: 'sel2bCreateCarrier',
        list: 'sel2bViewMenuCarrier',
    },
    'bank': {
        view: 'sel2bViewBank',
        edit: 'sel2bEditBank',
        create: 'sel2bCreateBank',
        delete: 'sel2bDeleteBank',
        list: 'sel2bViewMenuBank',
    },
    'payment-term': {
        view: 'sel2bViewPaymentTerm',
        edit: 'sel2bEditPaymentTerm',
        create: 'sel2bCreatePaymentTerm',
        list: 'sel2bViewMenuPaymentTerm',
    },
    'return-reason': {
        view: 'sel2bViewReturnReason',
        edit: 'sel2bEditReturnReason',
        create: 'sel2bCreateReturnReason',
        delete: 'sel2bDeleteReturnReason',
        list: 'sel2bViewMenuReturnReason',
    },
    'discount-category': {
        view: 'sel2bViewDiscountCategory',
        edit: 'sel2bEditDiscountCategory',
        create: 'sel2bCreateDiscountCategory',
        list: 'sel2bViewMenuDiscountCategory',
    },
    'late-fee-policy': {
        view: 'sel2bViewLateFeePolicy',
        edit: 'sel2bEditLateFeePolicy',
        create: 'sel2bCreateLateFeePolicy',
        list: 'sel2bViewMenuLateFeePolicy',
    },
    'chasing-config': {
        edit: 'sel2bInvoiceChasingConfiguration',
        list: 'sel2bViewMenuInvoiceChasingConfiguration',
    },
    'ledger': {
        view: 'sel2bViewGeneralLedgerAccountSetup',
        edit: 'sel2bEditGeneralLedgerAccountSetup',
        create: 'sel2bCreateGeneralLedgerAccountSetup',
        sync: 'sel2bSyncGeneralLedgerAccountSetupToQuickBooks',
        list: 'sel2bViewMenuGeneralLedgerAccountSetup',
    },
    'payment-methods': {
        view: 'sel2bViewPaymentMethod',
        edit: 'sel2bEditPaymentMethod',
        create: 'sel2bCreatePaymentMethod',
        delete: 'sel2bDeletePaymentMethod',
        list: 'sel2bViewMenuPaymentMethod',
    },
    'sales-tax-auth': {
        view: 'sel2bViewSalesTaxAuthority',
        edit: 'sel2bEditSalesTaxAuthority',
        create: 'sel2bCreateSalesTaxAuthority',
        list: 'sel2bViewMenuSalesTaxAuthority',
    },
    'shipping-zone': {
        view: 'sel2bViewShippingZone',
        edit: 'sel2bEditShippingZone',
        create: 'sel2bCreateShippingZone',
        list: 'sel2bViewMenuShippingZone',
    },
    'quickbook-overview': {
        view: 'sel2bViewQuickBooks',
        list: 'sel2bViewMenuQuickBooks',
    },
    // 'menu': {
    //     sel2bViewMenuARInvoice: false,
    //     sel2bViewMenuBank: false,
    //     sel2bViewMenuCarrier: false,
    //     sel2bViewMenuCreditMemo: false,
    //     sel2bViewMenuCustomer: false,
    //     sel2bViewMenuDebitMemo: false,
    //     sel2bViewMenuDiscountCategory: false,
    //     sel2bViewMenuGeneralLedgerAccountSetup: false,
    //     sel2bViewMenuInventory: false,
    //     sel2bViewMenuInvoiceChasingConfiguration: false,
    //     sel2bViewMenuLateFeePolicy: false,
    //     sel2bViewMenuMiscellaneousItem: false,
    //     sel2bViewMenuPartManagement: false,
    //     sel2bViewMenuPaymentMethod: false,
    //     sel2bViewMenuPaymentTerm: false,
    //     sel2bViewMenuQuickBooks: false,
    //     sel2bViewMenuReceiptVoucher: false,
    //     sel2bViewMenuReturnOrder: false,
    //     sel2bViewMenuReturnReason: false,
    //     sel2bViewMenuSaleOrder: false,
    //     sel2bViewMenuSaleQuotation: false,
    //     sel2bViewMenuSalesTaxAuthority: false,
    //     sel2bViewMenuShippingZone: false,
    //     sel2bViewMenuWarehouse: false,
    // }
};
