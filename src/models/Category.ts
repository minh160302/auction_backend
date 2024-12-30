import { DataTypes, Model, Sequelize } from "sequelize";

export class Category extends Model {
    public category_id!: number;
    public name!: string;
    public mainCategoriesName!: string;
}

export const initCategoryModel = (sequelize: Sequelize) => {
    Category.init(
        {
            category_id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            mainCategoriesName: {
                type: DataTypes.STRING,
                allowNull: false
            }
        },
        {
            sequelize,
            modelName: "Category",
            tableName: "Categories",
            timestamps: false,
        }
    );
};
