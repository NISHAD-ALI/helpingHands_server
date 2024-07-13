"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const eventModel_1 = __importDefault(require("../database/eventModel"));
const communityModel_1 = __importDefault(require("../database/communityModel"));
class eventRepository {
    createEvent(events) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let newEvent = new eventModel_1.default(events);
                yield newEvent.save();
                console.log('Saved to DB:', newEvent);
                yield communityModel_1.default.updateOne({ _id: newEvent.communId }, { $push: { events: newEvent._id } });
                return newEvent ? newEvent.toObject() : null;
            }
            catch (error) {
                console.error("Error creating event:", error.message);
                throw new Error('Unable to create event');
            }
        });
    }
    getEvents(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield communityModel_1.default.findOne({ _id: id }).populate('events');
                return data;
            }
            catch (error) {
                console.error(error.message);
                throw new Error('unable to fetch list of events');
            }
        });
    }
    getEventsById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let event = yield eventModel_1.default.findOne({ _id: id });
                return event;
            }
            catch (error) {
                console.error(error.message);
                throw new Error('unable to fetch event');
            }
        });
    }
    deleteEvent(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let event = yield eventModel_1.default.deleteOne({ _id: id });
                return event;
            }
            catch (error) {
                console.error(error.message);
                throw new Error('unable to delete event');
            }
        });
    }
    editEvent(id, eventData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedEvent = yield eventModel_1.default.findByIdAndUpdate(id, eventData, { new: true });
                return updatedEvent ? updatedEvent.toObject() : null;
            }
            catch (error) {
                console.error("Error updating event:", error.message);
                throw new Error('Unable to update event');
            }
        });
    }
    getEventsFilteredByDateRange(startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const filteredEvents = yield eventModel_1.default.find({
                    shifts: {
                        $elemMatch: {
                            date: { $gte: startDate, $lte: endDate },
                        },
                    }
                });
                return filteredEvents;
            }
            catch (error) {
                console.error('Error fetching filtered events:', error);
                throw new Error('Unable to fetch list of events');
            }
        });
    }
    getEventsFilteredByCategory(name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const filteredEvents = yield eventModel_1.default.find({ category: name });
                return filteredEvents;
            }
            catch (error) {
                console.error('Error fetching filtered events:', error);
                throw new Error('Unable to fetch list of events');
            }
        });
    }
    getEventsFilteredByDay(date) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const filteredEvents = yield eventModel_1.default.find({ shifts: {
                        $elemMatch: {
                            date: date,
                        },
                    } });
                return filteredEvents;
            }
            catch (error) {
                console.error('Error fetching filtered events:', error);
                throw new Error('Unable to fetch list of events');
            }
        });
    }
    searchEvents(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const events = yield eventModel_1.default.find({
                    $or: [
                        { name: { $regex: query, $options: 'i' } },
                        { details: { $regex: query, $options: 'i' } }
                    ]
                });
                return events;
            }
            catch (error) {
                console.error('Error searching events:', error);
                throw new Error('Unable to fetch list of events');
            }
        });
    }
}
exports.default = eventRepository;
