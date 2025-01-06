import { sequelize } from "@models/index";
import { PlaceBidRequest, ViewAuctionBidsRequest } from "@models/ws";
import BidService from "@services/BidService";
import SnsClient from "@aws/sns";

/**
 * Sample input: {"action": "view_auctions_bid", "body": {"auction_id": 1}}
 */
const viewBidsByAuction = async (data: ViewAuctionBidsRequest) => {
    // console.log("data", data);
    await sequelize.authenticate();
    const auctionId = data.auction_id;
    const bids = await BidService.getBidsByAuctionId(parseInt(auctionId));
    return bids;
}

/**
 * User place a bid in an auction
 *      Sample input: {"action": "place_bid", "body": {"user_id": 1, "auction_id": 1, "price": 100}}
 *      - create new bid record
 *      - publish message to SNS if success
 */
const placeBid = async (data: PlaceBidRequest) => {
    // console.log(data);
    await sequelize.authenticate();
    const { user_id, auction_id, price } = data;
    const newlyCreatedBid = await BidService.createBid(user_id, auction_id, price);
    await SnsClient.publishBidUpdate(auction_id, price, user_id);
    return newlyCreatedBid;
}

export default { viewBidsByAuction, placeBid };