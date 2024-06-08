import { ObjectId } from "mongoose"

interface community{
    _id:string,
    email:string,
    name:string,
    phone:number,
    password:string,
    volunteers: { volunteerId: string; is_accepted: boolean }[];
    profileImage:string,
    about:string,
    events:[ObjectId],
    is_blocked:boolean
}

export default community