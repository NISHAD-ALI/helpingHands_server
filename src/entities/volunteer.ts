import { ObjectId } from "mongoose"

interface volunteer {
    _id: string,
    name: string,
    email: string,
    address: string,
    phone: number,
    is_blocked: boolean,
    password: string,
    profileImage: string,
    events: [ObjectId],
    bloodGroup: string,
    about:string,
    communities:[ObjectId],

}

export default volunteer