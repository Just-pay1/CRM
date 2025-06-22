import { DataTypes, Model } from "sequelize";
import sequelize, { Sequelize } from "sequelize/types/sequelize";
import { v4 as uuidv4 } from 'uuid';
import { mysql } from "../db/config";
import { Merchant } from "./merchant-model";


export class Service extends Model {
    static initialize(sequelize: Sequelize) {
        Service.init(
            {
                id: {
                    type: DataTypes.UUID,
                    defaultValue: () => uuidv4(),
                    allowNull: false,
                    primaryKey: true,
                },
                service_type: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    unique: true,
                }
            },
            {
                tableName: 'services',
                sequelize,
                timestamps: true,
                underscored: true,
            }
        )
    }

    static associate() {
        Service.hasMany(Merchant, {
            foreignKey: 'service_id',
            as: 'merchants',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });
    }
}

// Service.init(
//     {
//         id: {
//             type: DataTypes.UUID,
//             defaultValue: () => uuidv4(),
//             allowNull: false,
//             primaryKey: true,
//         },
//         service_type: {
//             type: DataTypes.STRING,
//             allowNull: false,
//             unique: true,
//         }
//     },
//     {
//         tableName: 'services',
//         sequelize: mysql,
//         timestamps: true,
//         underscored: true,
//     }
// )

// Service.hasMany(Merchant, {
//     foreignKey: 'service_id',
//     as: 'merchants',
//     onDelete: 'CASCADE',
//     onUpdate: 'CASCADE'
// });