import { Bookmark } from "../models";

class BookmarkService {
    async getBookmarks() {
        return Bookmark.findAll({ limit: 100 });
    }

    // async getBookmarkById(id: number) {
    //     return Bookmark.findByPk(id);
    // }

    public async queryBookmarks(params: { [key: string]: any }) {
        const data = await Bookmark.findAll({
            where: params
        });
        return data;
    }

    async deleteBookmark(params: { [key: string]: any }) {
        await Bookmark.destroy({ where: params });
    }
    async createBookmark(bookmark: any) {
        const b = await Bookmark.create(bookmark);
        await b.save();
    }
}

export default new BookmarkService();
