import community from "../../entities/community";

interface ICommunityInterface{
    findCommunityByEmail(email:string):Promise<community|null>
    saveCommunity(community:community):Promise<community |null>
}

export default ICommunityInterface