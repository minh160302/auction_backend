import { sequelize } from '@models/index';
import BidService from '@services/BidService';
import express, { Request, Response } from 'express';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
    try {
        // Authenticate and sync database
        await sequelize.authenticate();
        console.log("Database connection established successfully.");
        const users = await BidService.getBids();
        res.json(users.map((b) => b.toJSON()));
    } catch (error) {
        console.error("Error:", error);
    } finally {
        /**
        Close all connections used by this sequelize instance, and free all references so the instance can be garbage collected.
        Normally this is done on process exit, so you only need to call this method if you are creating multiple instances, and want to garbage collect some of them.

        In this case, calling close leads to 
        Error: Error: ConnectionManager.getConnection was called after the connection manager was closed!
         */
        // await sequelize.close();
    }
});

export default router;
