import communityModel from "../database/communityModel";
import community from "../../entities/community";
import ICommunityInterface from "../../useCases/interfaces/ICommunityInterface";


class communityRepository implements ICommunityInterface {
    async findCommunityByEmail(email: string): Promise<community | null> {
        try {
            let data = await communityModel.findOne({ email: email })
            return data ? data.toObject() : null
        } catch (error: any) {
            console.error(error.message)
            throw new Error('unable to fetch community')
        }

    }
    async saveCommunity(community: community): Promise<community | null> {
        try {
            let newComm = new communityModel(community)
            await newComm.save();
            return newComm ? newComm.toObject() : null
           
        }catch(error:any){
            console.error(error.mesaage)
            throw new Error('Error while saving community data')
        }
    }
}

export default communityRepository