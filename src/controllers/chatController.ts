import { Request, Response } from "express";
import chatUsecase from "../useCases/chatUsecase";

class chatController {
    private chatUsecase: chatUsecase
    constructor(chatUsecase: chatUsecase) {
        this.chatUsecase = chatUsecase
    }
  async getCommunityDefaultMessages(req: Request, res: Response): Promise<void> {
    try {
        console.log("iii")
      const { id } = req.params;
      const messages = await this.chatUsecase.getDefaultConversationMessages(id);

      res.status(200).json(messages);
    } catch (error :any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getVolunteers(req: Request, res: Response): Promise<void> {
    try {
      const { communityId } = req.params;
      const volunteers = await this.chatUsecase.getVolunteersInCommunity(communityId);
      res.status(200).json(volunteers);
    } catch (error :any) {
      res.status(500).json({ error: error.message });
    }
  }
  async sendMessage(req: Request, res: Response): Promise<void> {
    try {
        const { sender, group, content } = req.body;
        const message = await this.chatUsecase.sendMessage(sender, group, content);
        res.status(201).json(message);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

}

export default chatController