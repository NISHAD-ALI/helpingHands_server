import admin from "../../entities/admin";
import community from "../../entities/community";
import donations from "../../entities/donations";
import user from "../../entities/user";

interface IAdminInterface{
    findAdminByEmail(email: string): Promise<admin | null>,
    getCommunities():Promise<community | null>,
    getUsers():Promise<user | null>,
    blockUser(id: string): Promise<boolean>,
    createDonation(donation: donations): Promise<donations | null>,
    getDonations():Promise<donations | null>
    getAllReports():Promise<any | null>
    getAllVolunteeers(): Promise<any | null>
    getEvents(): Promise<any | null>
}
export default IAdminInterface;