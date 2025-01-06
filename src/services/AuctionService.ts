import { Auction, Product } from "../models";

class AuctionService {
    public async createAuction(name: string, description: string, start_time: Date, end_time: Date, product_id: string, starting_price: number) {
        const data = Auction.build({
            name, description, start_time, end_time, product_id, starting_price,
            status: "ACTIVE"
        });
        const auction = await data.save();
        return auction;
    }

    public async getAuctions() {
        const data = await Auction.findAll({ limit: 100 });
        return data;
    }

    public async getAuctionsById(id: number) {
        const data = await Auction.findByPk(id);
        return data;
    }

    public async queryAuctions(params: { [key: string]: any }) {
        const data = await Auction.findAll({
            where: params
        });
        return data;
    }

    /**
     * Eager Loading
     */
    public async eager_getAuctions() {
        const data = await Auction.findAll({
            limit: 100,
            include: {
                model: Product,
                required: true,
            }
        });
        return data;
    }

    public async eager_queryAuctions(params: { [key: string]: any }) {
        const data = await Auction.findAll({
            where: params,
            include: {
                model: Product,
                // required: true,
            }
        });
        return data;
    }
}

export default new AuctionService();
