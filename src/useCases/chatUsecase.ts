import chatRepository from "../frameworks/repositories/chatRepository";
import communityRepository from "../frameworks/repositories/communityRepository";
import volunteerRepository from "../frameworks/repositories/volunteerRepository";

class chatUsecase {
    private chatRepo: chatRepository;
    constructor(chatRepo: chatRepository,) {
        this.chatRepo = chatRepo
    }
  async getDefaultConversationMessages(communityId: string) {
    const conversation = await this.chatRepo.getDefaultConversationByCommunity(communityId);
    if (!conversation) {
      throw new Error('Default conversation not found for the community');
    }
    return await this.chatRepo.getMessagesByConversation(conversation._id);
  }

  async getVolunteersInCommunity(communityId: string) {
    return await this.chatRepo.getVolunteersByCommunity(communityId);
  }
  async sendMessage(sender: string, group: string, content: string) {
    return await this.chatRepo.saveMessage(sender, group, content);
}
}

export default chatUsecase
