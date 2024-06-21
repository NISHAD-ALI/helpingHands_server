import { ObjectId } from "mongoose"

export default interface donations{
    _id?:string,
    image:string,
    name:string,
    email:string,
    targetAmount:number,
    details:string,
    type:string
    startDate:string,
    endDate:string,
    contact:string,
    amountCollected?:number,
    donatedUsers?:[ObjectId],
    is_active?:boolean
}
