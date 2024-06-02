import eventModel from "../database/eventModel";
import events from "../../entities/events";
import IEventInterface from "../../useCases/interfaces/IEventInterface";
import communityModel from "../database/communityModel";

class eventRepository implements IEventInterface {
    async createEvent(events: events): Promise<events | null> {
        try {
            let newEvent = new eventModel(events);
            await newEvent.save();
            console.log('Saved to DB:', newEvent);
            await communityModel.updateOne(
                { _id: newEvent.communId },
                { $push: { events: newEvent._id } }
            );

            return newEvent ? newEvent.toObject() : null;
        } catch (error: any) {
            console.error("Error creating event:", error.message);
            throw new Error('Unable to create event');
        }
    }
    async getEvents(id: string):Promise<events | null>{
        try {
            let data: any = await communityModel.findOne({_id :id }).populate('events');
            console.log(data + "--------events data");
            
            return data
        } catch (error : any) {
            console.error(error.message)
            throw new Error('unable to fetch list of events')
        }
    }
    async getEventsById(id: string):Promise<events | null>{
        try {
            let event: any = await eventModel.findOne({_id:id})
            console.log(event);
            return event
        } catch (error : any) {
            console.error(error.message)
            throw new Error('unable to fetch event')
        }
    }
    async deleteEvent(id: string):Promise<Boolean | null>{
        try {
            let event: any = await eventModel.deleteOne({_id:id})
            console.log(event);
            return event
        } catch (error : any) {
            console.error(error.message)
            throw new Error('unable to delete event')
        }
    }

}

export default eventRepository