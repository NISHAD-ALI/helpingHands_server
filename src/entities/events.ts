import { ObjectId, Types } from "mongoose"

export default interface events{
    _id?:string,
    communId?:ObjectId,
    images:string[],
    video:string,
    name:string,
    volunteerCount:string,
    volunteers?:[ObjectId],
    details:string,
    shifts:[Shift],
    category:string,
    is_online:boolean,
    city:string
}


interface Shift {
    date: string;
    timeSlot: string;
}