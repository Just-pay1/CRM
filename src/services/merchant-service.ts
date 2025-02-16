import { Merchant } from "../models/merchant-model";
import { WebError } from "../utilities/web-errors";
import { Request } from 'express';

export class MerchantService {

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

        if (user.role !== 'sales' && user.role !== 'superadmin') {
            throw WebError.Forbidden(`You are not authorized to do this action.`);
        }

        const sameMail = await Merchant.findOne({ where: { admin_email } });
        const sameNumber = await Merchant.findOne({ where: { telephone_number } });


        if (sameMail || sameNumber) {
            throw WebError.BadRequest(`Admin mail or Telephone number is in use, please review`)
        }

        const newMerchant = await Merchant.create(
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


        return newMerchant;
    }

    async listAllMerchnts(req: Request) {
        const page = +req.query.page! === 0 ? 1 : +req.query.page!;
        const limit = +req.query.limit!;
        const offset = (page - 1) * limit;
        const currentUser = req.body.user;

        const { count, rows } = await Merchant.findAndCountAll({ offset, limit });
        const response = {
            count,
            activePage: page,
            rows
        }
        return response;
    }

    async getDetails(data: any) {
        const { id, user } = data;

        const merchant = await Merchant.findOne({ where: { id } });
        if(!merchant){
            throw WebError.BadRequest(`invalid merchant id, please review.`)
        }

        const needApprove = [
            { 
                isApproved: merchant.dataValues.financial_approved,
                action: '/merchant/financial-approve'
            },
            { 
                isApproved: merchant.dataValues.operation_approved,
                action: '/merchant/operation-approve'
            }
        ]

        const response = {
            ...merchant.dataValues,
            needApprove: needApprove
        }
        return response;
    }

    async financialApprove(data: any) {
        console.log(data);
        const { id, user } = data;

        if (user.role !== 'financial' && user.role !== 'superadmin') {
            throw WebError.Forbidden(`You are not authorized to do this action.`);
        }

        const merchant = await Merchant.findOne({ where: { id } });
        if (!merchant) {
            throw WebError.BadRequest(`invalid merchant ID, please review.`);
        }

        if(merchant.dataValues.financial_approved){
            throw WebError.BadRequest(`This merchant is already approved, please review.`);
        }

        await merchant.update({
            financial_approved: true
        })

        return true

    }

    async operationApprove(data: any) {
        const { id, user } = data;

        if (user.role !== 'operation' && user.role !== 'superadmin') {
            throw WebError.Forbidden(`You are not authorized to do this action.`);
        }

        const merchant = await Merchant.findOne({ where: { id } });
        if (!merchant) {
            throw WebError.BadRequest(`invalid merchant ID, please review.`);
        }

        if(!merchant.dataValues.financial_approved){
            throw WebError.BadRequest(`This merchant is not financially approved yet, please review.`);
        }

        if(merchant.dataValues.operation_approved){
            throw WebError.BadRequest(`This merchant is already approved, please review.`);
        }

        await merchant.update({
            operation_approved: true
        })

        return true

    }
}