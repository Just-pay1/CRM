import { CustomerProfile } from "../models/customer-profile-model";
import { WebError } from "../utilities/web-errors";

export class CustomerService {

    async createNewCustomer(data: any) {
        const {
            legal_name,
            commercial_name,
            address,
            commercial_reg_number,
            license_issue_date,
            license_exp_date,
            tax_id_number,
            telephone_number,
            admin_email,
            business_type,
            bank_name,
            account_holder_name,
            account_type,
            account_number,
            iban,
            swift,
            settlement_period,
            settlement_time,
            commission_setup,
            commission_amount,
            user
        } = data;

        if( user.role !== 'sales' && user.role !== 'superadmin') {
            throw WebError.Forbidden(`You are not authorized to do this action.`);
        }

        console.log('a7eh')

        const newCustomer = await CustomerProfile.create(
            {
                legal_name,
                commercial_name,
                address,
                commercial_reg_number,
                license_issue_date,
                license_exp_date,
                tax_id_number,
                telephone_number,
                admin_email,
                business_type,
                bank_name,
                account_holder_name,
                account_type,
                account_number,
                iban,
                swift,
                settlement_period,
                settlement_time,
                commission_setup,
                commission_amount,
            }
        )

        console.log(newCustomer.dataValues);
        
        return true;
    }
}