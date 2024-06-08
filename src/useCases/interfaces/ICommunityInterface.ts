import community from "../../entities/community";
import volunteer from "../../entities/volunteer";

interface ICommunityInterface {
    findCommunityByEmail(email: string): Promise<community | null>,
    saveCommunity(community: community): Promise<community | null>,
    findCommunityById(id: string): Promise<community | null>,
    editCommunity(id: string, community: community): Promise<boolean>,
    updateStatus(id: string, is_accepted: boolean, communityId: string): Promise<boolean>,
    getVolunteers(id: string): Promise<volunteer[] | null>
}

export default ICommunityInterface