import { sequelize } from '@models/index';
import ProductService from '@services/ProductService';
import express, { Request, Response } from 'express';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
    try {
        // Authenticate and sync database
        await sequelize.authenticate();
        const products = await ProductService.getProducts();
        res.json(products.map((p) => p.toJSON()));
    } catch (error) {
        console.error("Error:", error);
    }
});

export default router;
