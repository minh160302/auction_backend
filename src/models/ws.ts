/**
 * Example:
 *         {"action": "view_auctions_bid", "body": {"auction_id": 1}}
 */

export type WsAction<T> = {
    action: Action,
    body: T
}

export type ViewAuctionBidsRequest = {
    auction_id: string;
}

export type PlaceBidRequest = {
    user_id: string;
    auction_id: string;
    price: number;
}

export enum Action {
    VIEW_AUCTION_BIDS = "view_auction_bids",
    PLACE_BID = "place_bid",
}