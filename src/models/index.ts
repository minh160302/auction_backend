import Database from "@config/Database";
import { initUserModel, User } from "@models/User";
import { initMainCategoryModel, MainCategory } from "@models/MainCategory";
import { initCategoryModel, Category } from "@models/Category";
import { initProductModel, Product } from "@models/Product";
import { initAuctionModel, Auction } from "@models/Auction";
import { initBidModel, Bid } from "@models/Bid";

const sequelize = Database.getInstance();

// Initialize all models
initUserModel(sequelize);
initMainCategoryModel(sequelize);
initCategoryModel(sequelize);
initProductModel(sequelize);
initAuctionModel(sequelize);
initBidModel(sequelize);


// Relationships
MainCategory.hasMany(Category, {
    foreignKey: "mainCategoriesName",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});
Category.belongsTo(MainCategory, {
    foreignKey: "mainCategoriesName"
});


Category.hasMany(Product, {
    foreignKey: "category_id",
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
});
Product.belongsTo(Category, {
    foreignKey: "category_id"
});


Auction.hasOne(Product, {
    foreignKey: "product_id"
});
Product.belongsTo(Auction, {
    foreignKey: "product_id"
});


Auction.hasMany(Bid, {
    foreignKey: "auction_id",
    onDelete: "SET NULL",
    onUpdate: "CASCADE"
});
Bid.belongsTo(Auction, {
    foreignKey: "auction_id",
});
User.hasMany(Bid, {
    foreignKey: "user_id",
    onDelete: "SET NULL",
    onUpdate: "CASCADE"
});
Bid.belongsTo(User, {
    foreignKey: "user_id",
});

export { sequelize, User, MainCategory, Category, Product, Auction, Bid };