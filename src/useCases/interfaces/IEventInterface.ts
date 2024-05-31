import events from "../../entities/events";

export default interface IEventInterface {
    createEvent(events: events): Promise<events | null>,
}