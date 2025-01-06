import Cache from "@config/Redis";
import { Bid } from "@models/index";
import AuctionService from "./AuctionService";
import Constants from "@utils/Constants";

class BidService {
    public async getBids() {
        return await Bid.findAll({ limit: 100 });
    }

    public async getBidsByAuctionId(auctionId: number) {
        const bids = await Bid.findAll({
            where: {
                auction_id: auctionId
            },
            order: [['price', 'DESC']]
        })
        return bids;
    }

    public async createBid(userId: string, auctionId: string, price: number) {
        // * Notes: Store the highest bid of each auction in cache
        const validator = await this.validateBidCondition(userId, auctionId, price);
        if (!validator.result) {
            throw new Error(validator.message);
        }

        const bid = await Bid.create({
            user_id: userId,
            auction_id: auctionId,
            price: price,
            placed_at: Date.now()
        });

        return bid;
    }

    /**
     * Flow:
     *  - check cache for highest bid so far
     *  - if no cache, check database (bid history)
     *  - if no bids placed, check auction's starting price
     */
    private async validateBidCondition(userId: string, auctionId: string, price: number) {
        const cache = Cache.getInstance();
        const cacheKey = `highest_bid_auction_${auctionId}`;
        const auctionInfo = await cache.get(cacheKey);

        if (auctionInfo) {
            const json = JSON.parse(auctionInfo);
            if (json["user_id"] === userId) {
                return {
                    result: false,
                    message: "You have placed the highest bid already!",
                }
            }
            else if (json["price"] + Constants.BID_INCREMENT > price) {
                return {
                    result: false,
                    message: "Insufficient bid amount!",
                }
            }
        }
        else {
            const highestBid = await Bid.findOne({
                where: {
                    auction_id: auctionId
                },
                order: [['price', 'DESC']]
            });
            if (highestBid) {
                // TODO: check bid history -- done
                if (highestBid.user_id === parseInt(userId)) {
                    return {
                        result: false,
                        message: "You have placed the highest bid already!",
                    }
                }
                else if (highestBid.price >= price) {
                    return {
                        result: false,
                        message: "Insufficient bid amount!",
                    }
                }
            }
            else {
                // TODO: check starting price -- done
                const isHigher = await this.isHigherThanStartingPrice(auctionId, price);
                if (!isHigher)
                    return {
                        result: false,
                        message: "Insufficient bid amount!",
                    }
            }
        }

        // Set cache
        await cache.set(cacheKey, JSON.stringify({
            user_id: userId,
            price: price
        }));
        return { result: true, message: "" }
    }

    private async isHigherThanStartingPrice(auctionId: string, price: number): Promise<boolean> {
        const auction = await AuctionService.getAuctionsById(parseInt(auctionId));
        if (!auction) return false;
        return price >= auction.starting_price;
    }
}

export default new BidService();
