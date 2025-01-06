import { Bookmark, sequelize } from '@models/index';
import BookmarkService from '@services/BookmarkService';
import { HttpError } from '@utils/HttpError';
import express, { NextFunction, Request, Response } from 'express';
import SnsClient from "@aws/sns";

const router = express.Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const queryParams = req.query;
        // Authenticate and sync database
        await sequelize.authenticate();
        const categories = Object.keys(queryParams).length === 0
            ? await BookmarkService.getBookmarks()
            : await BookmarkService.queryBookmarks(queryParams);
        res.json(categories.map((c) => c.toJSON()));
    } catch (error) {
        if (error instanceof HttpError)
            next(error);
        else
            next(new HttpError("Bad request: " + error, 400));
    }
});

/**
 * User bookmark an Auction
 * - create a record
 * - subscribe to SNS topic (auction_id)
 */
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const bookmark: Bookmark = req.body;
        await BookmarkService.createBookmark(bookmark);
        await SnsClient.subscribeUserToAuction(bookmark.auction_id.toString(), bookmark.user_id.toString());
        res.json(bookmark);
    } catch (error) {
        next(new HttpError("Bad request: " + error, 400));
    }
});

/**
 * User delete a bookmark from an Auction
 * - remove the record
 * - unsubscribe the SNS topic
 */
router.delete('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const queryParams = req.query;
        await BookmarkService.deleteBookmark(queryParams);
        if (queryParams.auction_id && queryParams.user_id) {
            await SnsClient.unsubscribeUserFromAuction(queryParams.auction_id.toString(), queryParams.user_id.toString());
        }
        res.json({ message: "Bookmark deleted successfully" });
    } catch (error) {
        next(new HttpError("Bad request: " + error, 400));
    }
});

export default router;
