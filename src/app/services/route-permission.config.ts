export const ROUTE_PERMISSION = {
    // Customer Management
    'customer': {
        view: 'VIEW_CUSTOMER',
        create: 'CREATE_CUSTOMER',
        edit: 'EDIT_CUSTOMER',
    },
    // Product Management
    'part-list': {
        view: 'VIEW_PART',
        edit: 'EDIT_PART',
    },
    'miscellaneous-list': {
        view: 'VIEW_MISC',
        edit: 'EDIT_MISC',
        create: 'CREATE_MISC',
        delete: 'DELETE_MISC',
    },
    'item-list': {
        view: 'VIEW_INVENTORY',
    },

    // Sales Management
    'sale-quotation': {
        view: 'VIEW_SALE_QUOTATION',
        edit: 'EDIT_SALE_QUOTATION',
        create: 'CREATE_SALE_QUOTATION',
        copy: 'COPY_SALE_QUOTATION',
        convert: 'CONVERT_SALE_QUOTATION',
        submit: 'SUBMIT_SALE_QUOTATION',
        approve: 'APPROVE_SALE_QUOTATION',
        reject: 'REJECT_SALE_QUOTATION',
        cancel: 'CANCEL_SALE_QUOTATION'
    },
    'sale-order': {
        view: 'VIEW_SALE_ORDER',
        edit: 'EDIT_SALE_ORDER',
        create: 'CREATE_SALE_ORDER',
        copy: 'COPY_SALE_ORDER',
        submit: 'SUBMIT_SALE_ORDER',
        approve: 'APPROVE_SALE_ORDER',
        reject: 'REJECT_SALE_ORDER',
        cancel: 'CANCEL_SALE_ORDER',
        reopen: 'REOPEN_SALE_ORDER',
    },

    // Financial
    'invoice': {
        view: 'VIEW_INVOICE',
        print: 'PRINT_INVOICE',
        edit: 'EDIT_INVOICE',
        create: 'CREATE_INVOICE',
        submit: 'SUBMIT_INVOICE',
        approve: 'APPROVE_INVOICE',
        reject: 'REJECT_INVOICE',
        cancel: 'CANCEL_INVOICE',
        mail: 'MAIL_INVOICE',
        revise: 'REVISE_INVOICE',
    },
    'receipt-voucher': {
        view: 'VIEW_RECEIPT_VOUCHER',
        edit: 'EDIT_RECEIPT_VOUCHER',
        create: 'CREATE_RECEIPT_VOUCHER',
        submit: 'SUBMIT_RECEIPT_VOUCHER',
        approve: 'APPROVE_RECEIPT_VOUCHER',
        reject: 'REJECT_RECEIPT_VOUCHER',
        cancel: 'CANCEL_RECEIPT_VOUCHER',
    },
    'credit-memo': {
        view: 'VIEW_CREDIT_MEMO',
        print: 'PRINT_CREDIT_MEMO',
        edit: 'EDIT_CREDIT_MEMO',
        create: 'CREATE_CREDIT_MEMO',
        submit: 'SUBMIT_CREDIT_MEMO',
        approve: 'APPROVE_CREDIT_MEMO',
        reject: 'REJECT_CREDIT_MEMO',
        cancel: 'CANCEL_CREDIT_MEMO',
        apply: 'APPLY_CREDIT_MEMO',
        reopen: 'REOPEN_CREDIT_MEMO',
        mail: 'MAIL_CREDIT_MEMO',
    },
    'debit-memo': {
        view: 'VIEW_DEBIT_MEMO',
        print: 'PRINT_DEBIT_MEMO',
        edit: 'EDIT_DEBIT_MEMO',
        create: 'CREATE_DEBIT_MEMO',
        submit: 'SUBMIT_DEBIT_MEMO',
        approve: 'APPROVE_DEBIT_MEMO',
        reject: 'REJECT_DEBIT_MEMO',
        cancel: 'CANCEL_DEBIT_MEMO',
        reopen: 'REOPEN_DEBIT_MEMO',
        mail: 'MAIL_DEBIT_MEMO',
    },
    // Admin Panel
    'warehouse': {
        view: 'VIEW_WAREHOUSE',
        ship: 'SHIP_WAREHOUSE',
        enable: 'ENABLE_WAREHOUSE'
    },
    'carrier': {
        view: 'VIEW_CARRIER',
        edit: 'EDIT_CARRIER',
        create: 'CREATE_CARRIER',
    },
    'bank': {
        view: 'VIEW_BANK',
        edit: 'EDIT_BANK',
        create: 'CREATE_BANK',
        delete: 'DELETE_BANK',
    },
    'payment-term': {
        view: 'VIEW_PAYMENT_TERM',
        edit: 'EDIT_PAYMENT_TERM',
        create: 'CREATE_PAYMENT_TERM',
    },
    'return-reason': {
        view: 'VIEW_RETURN_REASON',
        edit: 'EDIT_RETURN_REASON',
        create: 'CREATE_RETURN_REASON',
        delete: 'DELETE_RETURN_REASON',
    },
    'discount-category': {
        view: 'VIEW_DISCOUNT_CATEGORY',
        edit: 'EDIT_DISCOUNT_CATEGORY',
        create: 'CREATE_DISCOUNT_CATEGORY',
    },
    'late-fee-policy': {
        view: 'VIEW_LATE_FEE_POLICY',
        edit: 'EDIT_LATE_FEE_POLICY',
        create: 'CREATE_LATE_FEE_POLICY',
    },
    'invoice-config': {
        view: 'INVOICE_CONFIG',
    },
    'ledger': {
        view: 'VIEW_LEDGER',
        edit: 'EDIT_LEDGER',
        create: 'CREATE_LEDGER',
        sync: 'SYNC_LEDGER',
    },
    'payment-methods' : {
        view: 'VIEW_PAYMENT_METHOD',
        edit: 'EDIT_PAYMENT_METHOD',
        create: 'CREATE_PAYMENT_METHOD',
        delete: 'DELETE_PAYMENT_METHOD',
    },
    'sales-tax-auth' : {
        view: 'VIEW_SALES_TAX',
        edit: 'EDIT_SALES_TAX',
        create: 'CREATE_SALES_TAX',
    },
    'shipping-zone' : {
        view: 'VIEW_SHIPPING_ZONE',
        edit: 'EDIT_SHIPPING_ZONE',
        create: 'CREATE_SHIPPING_ZONE',
    },
    'quickbook-overview': {
        view: 'VIEW_QUICKBOOK',
    }
};
