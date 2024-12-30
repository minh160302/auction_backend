import { Category } from "../models";

class CategoryService {
    async getCategories() {
        return Category.findAll({ limit: 100 });
    }
}

export default new CategoryService();
