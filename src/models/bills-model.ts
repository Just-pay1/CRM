import { DataTypes, Model } from "sequelize";
import { mysql } from "../db/config";

export class Bills extends Model { }

Bills.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        merchantID: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('Pending', 'Paid'),
            defaultValue: 'Pending'
        },
    },
    {
        sequelize: mysql,
        tableName: 'bills',
        timestamps: true
    }
)