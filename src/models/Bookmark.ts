import { DataTypes, Model, Sequelize } from "sequelize";

export class Bookmark extends Model {
    public bookmark_id!: number;
    public user_id!: number;
    public auction_id!: number;
    public created_at!: Date;
    public bookmark_type!: string;
}

export const initBookmarkModel = (sequelize: Sequelize) => {
    Bookmark.init(
        {
            bookmark_id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            user_id: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
            auction_id: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            bookmark_type: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "Bookmark",
            tableName: "Bookmarks",
            timestamps: false,
        }
    );
};
