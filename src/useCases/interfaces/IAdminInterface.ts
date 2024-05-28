import admin from "../../entities/admin";
import community from "../../entities/community";

interface IAdminInterface{
    findAdminByEmail(email: string): Promise<admin | null>
    getCommunities():Promise<community | null>
}
export default IAdminInterface;