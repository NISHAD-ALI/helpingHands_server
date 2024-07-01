import message from "../../entities/message";
import messageModel from "../database/messageModel";
import volunteerModel from "../database/volunteerModel";
import communityModel from "../database/communityModel";
import ConversationModel from "../database/conversationModel";

class chatRepository {
    async getMessagesByConversation(conversationId: string): Promise<message[]> {
        let data = await messageModel.find({ conversation: conversationId })
            .sort({ timestamp: -1 })
            .populate('sender').exec();

        return data
    }
    async getVolunteersByCommunity(communityId: string) : Promise<any> {
        let data = await volunteerModel.find({ communities: communityId }).populate('volunteers.volunteerId').exec();
        return data
    }
    async getDefaultConversationByCommunity(communityId: string): Promise<any> {
        console.log(communityId)
        const community = await ConversationModel.findOne({communityId : communityId}).populate('messages')
        console.log('-----------------------')
        console.log(community)
        console.log('-----------------------')
        return community;
    }
    async saveMessage(sender: string, group: string, content: string): Promise<message> {
        const newMessage = new messageModel({
            sender,
            group: group,
            content,
            timestamp: new Date()
        });
        await newMessage.save();
        return newMessage;
    }


}

export default chatRepository
