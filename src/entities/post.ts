import { ObjectId } from "mongoose"
import comment from "./comment"
interface post {
    _id?: string
    userId: ObjectId
    title: string
    image: string
    likes?: Array<ObjectId>
    comments?: Array<comment>,
    postedDate?:Date
}

export default post;