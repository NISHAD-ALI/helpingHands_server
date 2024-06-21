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
    async getEvents(id: string): Promise<events | null> {
        try {
            let data: any = await communityModel.findOne({ _id: id }).populate('events');
            return data
        } catch (error: any) {
            console.error(error.message)
            throw new Error('unable to fetch list of events')
        }
    }
    async getEventsById(id: string): Promise<events | null> {
        try {
            let event: any = await eventModel.findOne({ _id: id })
            return event
        } catch (error: any) {
            console.error(error.message)
            throw new Error('unable to fetch event')
        }
    }
    async deleteEvent(id: string): Promise<Boolean | null> {
        try {
            let event: any = await eventModel.deleteOne({ _id: id })
            return event
        } catch (error: any) {
            console.error(error.message)
            throw new Error('unable to delete event')
        }
    }
    async editEvent(id: string, eventData: Partial<events>): Promise<events | null> {
        try {
            const updatedEvent = await eventModel.findByIdAndUpdate(id, eventData, { new: true });
            return updatedEvent ? updatedEvent.toObject() : null;
        } catch (error: any) {
            console.error("Error updating event:", error.message);
            throw new Error('Unable to update event');
        }
    }
    async getEventsFilteredByDateRange(startDate?: Date, endDate?: Date): Promise<events[]> {
        try {
            
            const filteredEvents = await eventModel.find({
                shifts: { 
                  $elemMatch: {
                    date: { $gte: startDate, $lte: endDate }, 
                  },
                }})
    
            return filteredEvents;
        } catch (error: any) {
            console.error('Error fetching filtered events:', error);
            throw new Error('Unable to fetch list of events');
        }
    }
    async getEventsFilteredByCategory(name:string): Promise<events[]> {
        try {
            const filteredEvents = await eventModel.find({category:name})
            return filteredEvents;
        } catch (error: any) {
            console.error('Error fetching filtered events:', error);
            throw new Error('Unable to fetch list of events');
        }
    }
    async getEventsFilteredByDay(date:Date): Promise<events[]> {
        try {
            const filteredEvents = await eventModel.find({shifts: { 
                $elemMatch: {
                  date:  date , 
                },
              }})
            return filteredEvents;
        } catch (error: any) {
            console.error('Error fetching filtered events:', error);
            throw new Error('Unable to fetch list of events');
        }
    }
    async searchEvents(query:string): Promise<events[]> {
        try {
            const events = await eventModel.find({
                $or: [
                    { name: { $regex: query, $options: 'i' } },
                    { details: { $regex: query, $options: 'i' } }
                ]
            })
            return events
        } catch (error: any) {
            console.error('Error searching events:', error);
            throw new Error('Unable to fetch list of events');
        }
    }
}

export default eventRepository