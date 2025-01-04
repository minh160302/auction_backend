import Database from "@config/Database";
import { initUserModel, User } from "@models/User";
import { initMainCategoryModel, MainCategory } from "@models/MainCategory";
import { initCategoryModel, Category } from "@models/Category";
import { initProductModel, Product } from "@models/Product";
import { initAuctionModel, Auction } from "@models/Auction";
import { initBidModel, Bid } from "@models/Bid";
import { initBookmarkModel, Bookmark } from "@models/Bookmark";

const sequelize = Database.getInstance();

// Initialize all models
initUserModel(sequelize);
initMainCategoryModel(sequelize);
initCategoryModel(sequelize);
initProductModel(sequelize);
initAuctionModel(sequelize);
initBidModel(sequelize);
initBidModel(sequelize);
initBookmarkModel(sequelize);

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


User.hasMany(Bookmark, {
    foreignKey: "user_id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
});
Bookmark.belongsTo(User, {
    foreignKey: "user_id",
});
Auction.hasMany(Bookmark, {
    foreignKey: "auction_id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
});
Bookmark.belongsTo(Auction, {
    foreignKey: "auction_id",
});


export { sequelize, User, MainCategory, Category, Product, Auction, Bid, Bookmark };