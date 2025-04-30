export interface MerchantAttributes {
    merchant_id: string;
    legal_name: string;
    commercial_name: string;
    address: string;
    commercial_reg_number: string;
    license_issue_date: string;
    license_exp_date: string;
    tax_id_number: string;
    telephone_number: string;
    admin_email: string;
    business_type: string;
    bank_name: string;
    account_holder_name: string;
    account_type: string;
    account_number: string;
    iban: string;
    swift: string;
    settlement_time: string;
    settlement_period: string;
    commission_amount: number;
    commission_setup: string;
    longitude: string;
    latitude: string;
}