import { Request, Response } from "express";
import chatUsecase from "../useCases/chatUsecase";

class chatController {
  private chatUsecase: chatUsecase
  constructor(chatUsecase: chatUsecase) {
    this.chatUsecase = chatUsecase
  }
  async getMessages(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const messages = await this.chatUsecase.getMessages(id);
      
      res.status(200).json(messages);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
  async sendMessage(req: Request, res: Response) {
    try {
      const {message} = req.body
      const { sender, group, content, communityId, conversation } = message
      console.log(sender, group, content, communityId, conversation,"---")
      const data = await this.chatUsecase.sendMessage(sender, group, content, conversation,communityId);
      res.status(201).json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
  async fetchConversation(req: Request, res: Response) {
    try {
      const id = req.params.id
      const conversation = await this.chatUsecase.fetchConversation(id)
      res.status(201).json(conversation);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default chatController