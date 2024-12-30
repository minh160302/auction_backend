import { sequelize } from "@models/index";
import { PlaceBidRequest, ViewAuctionBidsRequest, WsAction } from "@models/ws";
import BidService from "@services/BidService";


/**
 * Sample input: {"action": "view_auctions_bid", "body": {"auction_id": 1}}
 */
const viewBidsByAuction = async (data: WsAction<ViewAuctionBidsRequest>) => {
    // console.log("data", data);
    await sequelize.authenticate();
    const auctionId = data.body.auction_id;
    const bids = await BidService.getBidsByAuctionId(parseInt(auctionId));
    return bids;
}

/**
 * Sample input: {"action": "place_bid", "body": {"user_id": 1, "auction_id": 1, "price": 100}}
 */
const placeBid = async (data: WsAction<PlaceBidRequest>) => {
    // console.log(data);
    await sequelize.authenticate();
    const { user_id, auction_id, price } = data.body;
    await BidService.createBid(user_id, auction_id, price);
}

export default { viewBidsByAuction, placeBid };