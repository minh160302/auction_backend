import { DataTypes, Model, Sequelize } from "sequelize";

export class Product extends Model {
    public product_id!: number;
    public name!: string;
    public description!: string;
    public image_url!: string;
    public category_id!: string;
}

export const initProductModel = (sequelize: Sequelize) => {
    Product.init(
        {
            product_id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            description: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            image_url: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            category_id: {
                type: DataTypes.STRING,
                allowNull: true,
            }
        },
        {
            sequelize,
            modelName: "Product",
            tableName: "Products",
            timestamps: false,
        }
    );
};
