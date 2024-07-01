import mongoose, { Schema, Document } from 'mongoose';

interface conversation extends Document {
  communityId: mongoose.Schema.Types.ObjectId;
  participants: mongoose.Schema.Types.ObjectId[];
  messages: mongoose.Schema.Types.ObjectId;
}

const conversationSchema = new Schema<conversation>({
  communityId: {
    type: mongoose.Schema.Types.ObjectId,
      ref: 'community'
  },
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Volunteer'
    }
  ],
  messages: {
    type: mongoose.Schema.Types.ObjectId,
      ref: 'message'
  },
});

const ConversationModel = mongoose.model<conversation>('Conversation', conversationSchema);

export default ConversationModel;
