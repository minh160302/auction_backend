import { DataTypes, Model, Sequelize } from "sequelize";

export class User extends Model {
    public id!: number;
    public username!: string;
    public email!: string;
    public firstname!: string;
    public lastname!: string;
}

export const initUserModel = (sequelize: Sequelize) => {
    User.init(
        {
            user_id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            username: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            firstname: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            lastname: {
                type: DataTypes.STRING,
                allowNull: true,
            }
        },
        {
            sequelize,
            modelName: "User",
            tableName: "Users",
            timestamps: false,
        }
    );
};
