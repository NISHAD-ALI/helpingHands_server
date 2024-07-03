import chatRepository from "../frameworks/repositories/chatRepository";
import communityRepository from "../frameworks/repositories/communityRepository";
import volunteerRepository from "../frameworks/repositories/volunteerRepository";

class chatUsecase {
    private chatRepo: chatRepository;
    constructor(chatRepo: chatRepository,) {
        this.chatRepo = chatRepo
    }

  async getMessages(conversation: string) {
    const response = await this.chatRepo.getMessagesByConversation(conversation);
    return response
  }
  async sendMessage(sender:string, group:string, content:string, conversation:string,communityId:string) {
    return await this.chatRepo.saveMessage(sender, group, content, conversation,communityId);
}
async fetchConversation(id: string) {
  try {
      let response = await this.chatRepo.fetchConversations(id)
      return response
  } catch (error) {
      console.error(error)
      throw error
  }
}
}

export default chatUsecase
