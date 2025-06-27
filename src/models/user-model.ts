import { DataTypes, Model } from "sequelize";
import { mysql } from "../db/config";

export class User extends Model { }

User.init(
    {
        activeTokenID: {
            type: DataTypes.UUID,
            allowNull: true,
            defaultValue: null
        },
        resetToken: {
            type: DataTypes.UUID,
            allowNull: true,
            defaultValue: null
        },
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        first_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        middle_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        mobile: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isNumeric: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        pincode: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        dob: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        working_hours: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isNumeric: true
            }
        },
        working_days: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        is_loggedIn: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        },
        is_first_time: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false
        },
        holded: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        },
        deleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        },
        locked: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        login_attemps: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        img_url: {
            type: DataTypes.STRING,
            allowNull: true
        }
    },
    {
        sequelize: mysql,
        tableName: 'users',
        timestamps: true
    }
)