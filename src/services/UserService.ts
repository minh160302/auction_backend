import { User } from "../models";

class UserService {
    async getUsers() {
        return User.findAll({ limit: 100 });
    }

    async getUserById(id: number) {
        return User.findByPk(id);
    }

    public async queryUsers(params: { [key: string]: any }) {
        const data = await User.findAll({
            where: params
        });
        return data;
    }
}

export default new UserService();
