import { DataTypes, Model, Sequelize } from "sequelize";

export class Auction extends Model {
    public auction_id!: number;
    public name!: string;
    public description!: string;
    public status!: string;
    public created_at!: string;
    public start_time!: Date;
    public end_time!: Date;
    public product_id!: string;
    public starting_price!: number;
}

export const initAuctionModel = (sequelize: Sequelize) => {
    Auction.init(
        {
            auction_id: {
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
            status: {
                type: DataTypes.STRING,
                allowNull: true,
                defaultValue: "PENDING"
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            start_time: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            end_time: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            product_id: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            starting_price: {
                type: DataTypes.DOUBLE,
                defaultValue: 0.0
            },
            bids_count: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
                allowNull: true,
            }
        },
        {
            sequelize,
            modelName: "Auction",
            tableName: "Auctions",
            timestamps: false,
        }
    );
};
