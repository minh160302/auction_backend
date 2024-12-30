import { DataTypes, Model, Sequelize } from "sequelize";

export class MainCategory extends Model {
    public name!: string;
    public description!: string;
}

export const initMainCategoryModel = (sequelize: Sequelize) => {
    MainCategory.init(
        {
            name: {
                type: DataTypes.STRING,
                primaryKey: true,
            },
            description: {
                type: DataTypes.STRING
            }
        },
        {
            sequelize,
            modelName: "MainCategory",
            tableName: "MainCategories",
            timestamps: false,
        }
    );
};
