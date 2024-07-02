import message from "../../entities/message";
import messageModel from "../database/messageModel";
import volunteerModel from "../database/volunteerModel";
import communityModel from "../database/communityModel";
import ConversationModel from "../database/conversationModel";
import mongoose from "mongoose";

class chatRepository {
    async getMessagesByConversation(conversationId: string, role: string): Promise<message[]> {
        
        let data = await messageModel.find({ conversation: conversationId })
                .populate('group')
                .populate('sender')
        return data
    }
    async saveMessage(sender: string, group: string, content: string, conversation: string, communityId: string): Promise<message> {
        try {

            const newMessage = new messageModel({
                sender,
                conversation: conversation,
                content,
                timestamp: new Date(),
                group: communityId
            });

            await newMessage.save();

            return newMessage;
        } catch (error) {
            console.error("Error saving message:", error);
            throw error;
        }
    }

    async fetchConversations(volunteerId: string): Promise<any> {
        try {

            const conversations = await ConversationModel.find({ participants: { $in: volunteerId } })
                .populate('communityId')
                .populate('participants');

            return conversations
        } catch (error) {
            console.error("Error fetching conversation:", error);
            throw error;
        }
    }

}

export default chatRepository
