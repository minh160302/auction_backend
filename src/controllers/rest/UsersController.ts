import { sequelize } from '@models/index';
import UserService from '@services/UserService';
import { HttpError } from '@utils/HttpError';
import express, { NextFunction, Request, Response } from 'express';

const router = express.Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const queryParams = req.query;
        // Authenticate and sync database
        await sequelize.authenticate();
        // console.log("Database connection established successfully.");
        // await sequelize.sync({ force: true });
        const users = Object.keys(queryParams).length == 0
            ? await UserService.getUsers()
            : await UserService.queryUsers(queryParams);
        res.json(users.map((u) => u.toJSON()));
    } catch (error) {
        if (error instanceof HttpError)
            next(error);
        else
            next(new HttpError("Bad request: " + error, 400));
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

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = parseInt(req.params.id);
        // Authenticate and sync database
        await sequelize.authenticate();
        console.log("Database connection established successfully.");
        // await sequelize.sync({ force: true });
        const user = await UserService.getUserById(userId);
        if (user) {
            res.json(user.toJSON());
        }
        else {
            throw new HttpError("User Not Found", 404);
        }
    } catch (error) {
        if (error instanceof HttpError)
            next(error);
        else
            next(new HttpError("Bad request: " + error, 400));
    }
});

export default router;
