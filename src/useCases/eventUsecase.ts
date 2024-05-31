import community from "../entities/community";
import events from "../entities/events";
import Cloudinary from "../frameworks/utils/cloudinary";
import IEventInterface from "./interfaces/IEventInterface";

class eventUsecase {
    private eventRepo: IEventInterface;
    private cloudinary: Cloudinary
    constructor(eventRepo: IEventInterface,cloudinary: Cloudinary) {
        this.eventRepo = eventRepo
        this.cloudinary = cloudinary
    }
    async createEvent(eventData : events){
        try {
            let newEvent = await this.eventRepo.createEvent(eventData)
            if(newEvent){
                return { success: true }
            }else {
                return { success: false, message: 'Internal server error' }
            }
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}

export default eventUsecase