import { DataTypes, Model } from "sequelize";
import { mysql } from "../db/config";

export class Merchant extends Model { }

Merchant.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        legal_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        commercial_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        commercial_reg_number: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        license_issue_date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        license_exp_date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        tax_id_number: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        telephone_number: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isNumeric: true
            }
        },
        admin_email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        business_type: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        bank_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        account_holder_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        account_type: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        account_number: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        iban: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        swift: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        settlement_period: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        settlement_time: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        commission_setup: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        commission_amount: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        financial_approved: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        },
        operation_approved: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        },
        is_onboarding: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        },
        is_live: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        }
    },
    {
        sequelize: mysql,
        tableName: 'merchants',
        timestamps: true
    }
)