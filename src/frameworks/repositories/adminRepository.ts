import adminModel from "../database/adminModel";
import admin from "../../entities/admin";
import IAdminInterface from "../../useCases/interfaces/IAdminInterface";
import community from "../../entities/community";
import communityModel from "../database/communityModel";

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

}

export default adminRepository