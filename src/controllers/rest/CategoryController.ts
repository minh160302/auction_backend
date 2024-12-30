import { sequelize } from '@models/index';
import CategoryService from '@services/CategoryService';
import express, { Request, Response } from 'express';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
    try {
        // Authenticate and sync database
        await sequelize.authenticate();
        const categories = await CategoryService.getCategories();
        res.json(categories.map((c) => c.toJSON()));
    } catch (error) {
        console.error("Error:", error);
    }
});

export default router;
