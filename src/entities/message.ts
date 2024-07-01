import { ObjectId } from "mongoose"

interface message {
    _id?: string
    sender: ObjectId
    group: ObjectId
    content: string
    timestamp: Date
    conversation: ObjectId
}

export default message;