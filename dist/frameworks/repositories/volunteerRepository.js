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
const volunteerModel_1 = __importDefault(require("../database/volunteerModel"));
const communityModel_1 = __importDefault(require("../database/communityModel"));
const mongoose_1 = __importDefault(require("mongoose"));
const eventModel_1 = __importDefault(require("../database/eventModel"));
class volunteerRepository {
    findvolunteerByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let volunteerData = yield volunteerModel_1.default.findOne({ email: email });
                return volunteerData ? volunteerData.toObject() : null;
            }
            catch (error) {
                console.error(error.message);
                throw new Error('unable to fetch user data');
            }
        });
    }
    saveVolunteer(volunteer) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let newVolunteer = new volunteerModel_1.default(volunteer);
                yield newVolunteer.save();
                return newVolunteer ? newVolunteer.toObject() : null;
            }
            catch (error) {
                console.error(error.message);
                throw new Error('unable to save volunteer data');
            }
        });
    }
    findVolunteerById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let volunteerdata = yield volunteerModel_1.default.findById(id);
                return volunteerdata;
            }
            catch (err) {
                console.log(err);
                throw new Error("Failed to find volunteer");
            }
        });
    }
    changePassword(password, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let volunteer = yield volunteerModel_1.default.updateOne({ _id: id }, { $set: { password: password } });
                console.log("success");
                return volunteer.acknowledged;
            }
            catch (error) {
                console.log(error);
                throw new Error("Failed to update password");
            }
        });
    }
    editVolunteer(id, volunteer) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let newData = yield volunteerModel_1.default.updateOne({ _id: id }, volunteer, { new: true });
                return newData.acknowledged;
            }
            catch (error) {
                console.log(error);
                throw new Error("Failed to update volunteer Details");
            }
        });
    }
    enrollToCommunity(communityId, volunteerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(communityId, volunteerId);
                const volunteerObj = {
                    volunteerId: new mongoose_1.default.Types.ObjectId(volunteerId),
                    is_accepted: false
                };
                const result = yield communityModel_1.default.findOneAndUpdate({
                    _id: communityId,
                    "volunteers.volunteerId": { $ne: volunteerObj.volunteerId }
                }, { $addToSet: { volunteers: volunteerObj } }, { new: true });
                if (!result) {
                    console.error("Community not found");
                    return false;
                }
                console.log("Volunteer enrollment updated successfully.");
                return true;
            }
            catch (error) {
                console.error("Error updating volunteer acceptance:", error.message);
                throw new Error('Failed to enroll volunteer to community');
            }
        });
    }
    findEvents(volunteerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const volunteer = yield volunteerModel_1.default.findById(volunteerId).populate('communities');
                if (!volunteer) {
                    throw new Error('Volunteer not found');
                }
                const communityIds = volunteer.communities.map((community) => community._id);
                const events = yield eventModel_1.default.find({ communId: { $in: communityIds } });
                console.log(events);
                return events;
            }
            catch (error) {
                console.log(error);
                throw new Error('Failed to get volunteer community events');
            }
        });
    }
    notEnrolledEvents(volunteerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const volunteer = yield volunteerModel_1.default.findById(volunteerId).populate('events');
                if (!volunteer) {
                    throw new Error('Volunteer not found');
                }
                console.log(volunteer);
                const enrolledEventIds = volunteer.events.map((event) => event === null || event === void 0 ? void 0 : event._id.toString());
                console.log(enrolledEventIds);
                const allCommunityEvents = yield this.findEvents(volunteerId);
                if (!allCommunityEvents) {
                    return [];
                }
                const notEnrolledEvents = allCommunityEvents.filter((event) => !enrolledEventIds.includes(event._id.toString()));
                console.log(notEnrolledEvents);
                return notEnrolledEvents;
            }
            catch (error) {
                console.log(error);
                throw new Error('Failed to get volunteer community events');
            }
        });
    }
    enrollToEvents(volunteerId, eventId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const volunteer = yield volunteerModel_1.default.findById(volunteerId);
                if (!volunteer) {
                    throw new Error('Volunteer not found');
                }
                const eventObjectId = new mongoose_1.default.Types.ObjectId(eventId).toString();
                if (volunteer.events.map(event => event.toString()).includes(eventObjectId)) {
                    throw new Error('Volunteer is already enrolled in this event');
                }
                const addToVolunteer = yield volunteerModel_1.default.findByIdAndUpdate(volunteerId, { $push: { events: eventId } }, { new: true });
                console.log(addToVolunteer);
                if (!addToVolunteer) {
                    throw new Error('Failed to add volunteer to event');
                }
                const addToEvent = yield eventModel_1.default.findByIdAndUpdate(eventId, { $push: { volunteers: volunteerId } }, { new: true });
                if (!addToEvent) {
                    throw new Error('Failed to add volunteer to event');
                }
                return true;
            }
            catch (error) {
                console.error('Error enrolling volunteer to event:', error.message);
                throw new Error(error.message || 'Failed to add volunteer to event');
            }
        });
    }
    enrolledEvents(volunteerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const event = yield volunteerModel_1.default.findById(volunteerId).populate('events');
                return event;
            }
            catch (error) {
                console.log(error);
                throw new Error('Failed to get volunteer community events');
            }
        });
    }
}
exports.default = volunteerRepository;
