import { Product } from "../models";

class ProductService {
    async getProducts() {
        return Product.findAll({ limit: 100 });
    }
}

export default new ProductService();
