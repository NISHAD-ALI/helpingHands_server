import admin from "../../entities/admin";
import community from "../../entities/community";
import user from "../../entities/user";

interface IAdminInterface{
    findAdminByEmail(email: string): Promise<admin | null>,
    getCommunities():Promise<community | null>,
    getUsers():Promise<user | null>,
    blockUser(id: string): Promise<boolean>,
}
export default IAdminInterface;