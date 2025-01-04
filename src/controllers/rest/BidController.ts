import { sequelize } from '@models/index';
import BidService from '@services/BidService';
import { HttpError } from '@utils/HttpError';
import express, { NextFunction, Request, Response } from 'express';

const router = express.Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const query = req.query;
        // Authenticate and sync database
        await sequelize.authenticate();

        const bids = query["auction_id"]
            ? await BidService.getBidsByAuctionId(parseInt(query["auction_id"].toString()))
            : await BidService.getBids();
        res.json(bids.map((b) => b.toJSON()));
    } catch (error) {
        next(new HttpError("Bad request: " + error, 400));
    }
});

export default router;
