import { Sequelize } from "sequelize";

const dbHost = process.env.DB_HOST ?? "localhost";
const dbUser = process.env.DB_USER ?? "root";
const dbPassword = process.env.DB_PASSWORD ?? "";
const dbName = process.env.DB_NAME ?? "BiddingApplication";


class Database {
    private static instance: Sequelize;

    private constructor() { }

    public static getInstance(): Sequelize {
        if (!Database.instance) {
            Database.instance = new Sequelize(dbName, dbUser, dbPassword, {
                host: dbHost,
                dialect: "mysql",
                logging: false,
                pool: {
                    max: 5,
                    min: 0,
                    acquire: 30000,
                    idle: 10000
                }
            });
        }

        return Database.instance;
    }
}

export default Database;
