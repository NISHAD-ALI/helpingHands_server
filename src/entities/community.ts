import { ObjectId } from "mongoose"

interface community{
    _id:string,
    email:string,
    name:string,
    phone:number,
    password:string,
    volunteers:[ObjectId],
    profileImage:string,
    about:string,
    is_blocked:boolean
}

export default community