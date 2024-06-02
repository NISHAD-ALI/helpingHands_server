import events from "../../entities/events";

export default interface IEventInterface {
    createEvent(events: events): Promise<events | null>,
    getEvents(id: string):Promise<events | null>,
    getEventsById(id: string):Promise<events | null>,
    deleteEvent(id: string):Promise<Boolean | null>,
}