import { Auction, sequelize } from '@models/index';
import AuctionService from '@services/AuctionService';
import { HttpError } from '@utils/HttpError';
import express, { NextFunction, Request, Response } from 'express';
import EventBridgeClient from "@aws/eventbridge";

const router = express.Router();

/**
 * Query
 *  - WHERE
 *  - eager=true: eager load Auction & Product
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const query = req.query;

        let eager = false;
        if (query.eager) {
            eager = (query.eager.toString().toLowerCase() === "true");
            delete query.eager;
        }

        // Authenticate and sync database
        await sequelize.authenticate();

        if (!eager) {
            const auctions = Object.keys(query).length == 0
                ? await AuctionService.getAuctions()
                : await AuctionService.queryAuctions(query);
            res.json(auctions.map((a) => a.toJSON()));
        }
        else {
            const auctions = Object.keys(query).length == 0
                ? await AuctionService.eager_getAuctions()
                : await AuctionService.eager_queryAuctions(query);
            res.json(auctions.map((a) => a.toJSON()));
        }
    } catch (error) {
        if (error instanceof HttpError)
            next(error);
        else
            next(new HttpError("Bad request: " + error, 400));
    }
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const auctionId = parseInt(req.params.id);
        // Authenticate and sync database
        await sequelize.authenticate();
        const auction = await AuctionService.getAuctionsById(auctionId);
        if (auction)
            res.json(auction.toJSON());
        else
            throw new HttpError("Auction Not Found", 404);
    } catch (error) {
        if (error instanceof HttpError)
            next(error);
        else
            next(new HttpError("Bad request: " + error, 400));
    }
});



/**
 * Create auction
 * - insert record
 * - add EventBridge timed triggers
 */
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        // const hostUrl = `${req.protocol}://${req.get('host')}`;
        const hostUrl = `https://your-api.example.com`;
        console.log(hostUrl);
        const body: Auction = req.body;
        await sequelize.authenticate();
        const { name, description, start_time, end_time, product_id, starting_price } = body;
        const auction = await AuctionService.createAuction(name, description, start_time, end_time, product_id, starting_price);
        await EventBridgeClient.scheduleAuctionEnd(auction.auction_id.toString(), auction.end_time, hostUrl + "/auctions/deactivate", "some_auth_token");
        res.json({}).status(201);
    } catch (error) {
        if (error instanceof HttpError)
            next(error);
        else
            next(new HttpError("Bad request: " + error, 400));
    }
});


router.post('/activate', async (req: Request, res: Response, next: NextFunction) => {
    try {

    } catch (error) {
        if (error instanceof HttpError)
            next(error);
        else
            next(new HttpError("Bad request: " + error, 400));
    }
});

router.post('/deactivate', async (req: Request, res: Response, next: NextFunction) => {
    try {

    } catch (error) {
        if (error instanceof HttpError)
            next(error);
        else
            next(new HttpError("Bad request: " + error, 400));
    }
});

export default router;
