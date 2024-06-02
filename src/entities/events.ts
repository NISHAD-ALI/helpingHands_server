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

}


interface Shift {
    date: string;
    timeSlot: string;
}