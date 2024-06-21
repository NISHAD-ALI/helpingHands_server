import adminModel from "../database/adminModel";
import admin from "../../entities/admin";
import IAdminInterface from "../../useCases/interfaces/IAdminInterface";
import community from "../../entities/community";
import communityModel from "../database/communityModel";
import user from "../../entities/user";
import userModel from "../database/userModel";
import donations from "../../entities/donations";
import donationModel from "../database/donationModel";

class adminRepository implements IAdminInterface {
    async findAdminByEmail(email: string): Promise<admin | null> {
        try {
            let data = await adminModel.findOne({ email: email })
            console.log(data+"in repo")
            return data ? data.toObject() : null
        } catch (error: any) {
            console.error(error.message)
            throw new Error('unable to fetch admin')
        }

    }
    async getCommunities():Promise<community | null>{
        try {
            let data: any = await communityModel.find({})
            return data
        } catch (error : any) {
            console.error(error.message)
            throw new Error('unable to fetch list of communities')
        }
    }
    async getUsers():Promise<user | null>{
        try {
            let data: any = await userModel.find({})
            return data
        } catch (error : any) {
            console.error(error.message)
            throw new Error('unable to fetch list of users')
        }
    }
    async blockUser(id: string): Promise<boolean> {
        try {
            let user = await userModel.findById(id);
            if (user) {
                await userModel.findByIdAndUpdate(id, { $set: { is_blocked: !user.is_blocked } })
                return true;
            } else {
                return false;
            }
        } catch (err) {
            console.log(err);
            throw new Error("Failed to block user")
        }
    }
    async createDonation(donation: donations): Promise<donations | null> {
        try {
            let newDonation = new donationModel(donation);
            await newDonation.save();

            return newDonation ? newDonation.toObject() : null;
        } catch (error: any) {
            console.error("Error creating donation:", error.message);
            throw new Error('Unable to create donation');
        }
    }
    async getDonations():Promise<donations | null>{
        try {
            let data: any = await donationModel.find({})
            return data
        } catch (error : any) {
            console.error(error.message)
            throw new Error('unable to fetch list of donations')
        }
    }
}

export default adminRepository