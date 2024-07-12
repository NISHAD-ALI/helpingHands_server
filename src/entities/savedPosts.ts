import { ObjectId } from "mongoose"

interface savedPost {
    _id?: string
    userId: ObjectId
    postId:[ObjectId]
}

export default savedPost;