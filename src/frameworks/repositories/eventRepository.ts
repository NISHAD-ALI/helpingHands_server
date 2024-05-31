import eventModel from "../database/eventModel";
import events from "../../entities/events";
import IEventInterface from "../../useCases/interfaces/IEventInterface";


class eventRepository implements IEventInterface {
   async createEvent(events: events): Promise<events | null> {
        try {
            let newEvent = new eventModel(events)
            await newEvent.save();
            console.log('saved to Db');
            return newEvent ? newEvent.toObject() : null
        } catch (error : any) {
            console.error(error.message)
            throw new Error('unable to create event')
        }
    }
}

export default eventRepository