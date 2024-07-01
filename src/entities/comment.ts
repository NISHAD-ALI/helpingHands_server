import { ObjectId } from "mongoose"

interface comment {
    userId: ObjectId
    message: string
    createdAt: Date
}

export default comment;