import { DataTypes, Model, Sequelize } from "sequelize";

export class Bid extends Model {
    public bid_id!: number;
    public auction_id!: number;
    public user_id!: number;
    public placed_at!: Date;
    public price!: number;
}

export const initBidModel = (sequelize: Sequelize) => {
    Bid.init(
        {
            bid_id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            auction_id: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: true,
            },
            user_id: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: true,
            },
            placed_at: {
                type: DataTypes.DATE,
                allowNull: true,
                defaultValue: Date.now()
            },
            price: {
                type: DataTypes.DOUBLE,
                allowNull: true,
                defaultValue: 0.0
            }
        },
        {
            sequelize,
            modelName: "Bid",
            tableName: "Biddings",
            timestamps: false,
        }
    );
};
