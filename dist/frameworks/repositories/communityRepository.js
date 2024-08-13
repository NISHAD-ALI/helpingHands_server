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
const communityModel_1 = __importDefault(require("../database/communityModel"));
const volunteerModel_1 = __importDefault(require("../database/volunteerModel"));
const mongoose_1 = __importDefault(require("mongoose"));
const conversationModel_1 = __importDefault(require("../database/conversationModel"));
class communityRepository {
    findCommunityByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield communityModel_1.default.findOne({ email: email });
                return data ? data.toObject() : null;
            }
            catch (error) {
                console.error(error.message);
                throw new Error('unable to fetch community');
            }
        });
    }
    saveCommunity(community) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let newComm = new communityModel_1.default(community);
                yield newComm.save();
                return newComm ? newComm.toObject() : null;
            }
            catch (error) {
                console.error(error.mesaage);
                throw new Error('Error while saving community data');
            }
        });
    }
    findCommunityById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield communityModel_1.default.findById(id);
                return data;
            }
            catch (err) {
                console.log(err);
                throw new Error("Failed to find community");
            }
        });
    }
    editCommunity(id, community) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let newData = yield communityModel_1.default.updateOne({ _id: id }, community, { new: true });
                return newData.acknowledged;
            }
            catch (error) {
                console.log(error);
                throw new Error("Failed to update volunteer Details");
            }
        });
    }
    updateStatus(id, is_accepted, communityId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updateFields = { "volunteers.$[elem].is_accepted": is_accepted };
                if (is_accepted) {
                    updateFields["volunteers.$[elem].date"] = new Date();
                }
                const updatedCommunity = yield communityModel_1.default.findByIdAndUpdate(communityId, { $set: updateFields }, { new: true, arrayFilters: [{ "elem.volunteerId": new mongoose_1.default.Types.ObjectId(id) }] });
                const updatedVolunteer = yield volunteerModel_1.default.findByIdAndUpdate(id, { $push: { communities: communityId } }, { new: true });
                if (!updatedCommunity || !updatedVolunteer) {
                    throw new Error("Failed to update volunteer or community details");
                }
                // Add the volunteer to the default conversation participants
                const community = yield communityModel_1.default.findById(communityId);
                if (!community) {
                    throw new Error("Community not found");
                }
                const defaultConversationId = community.defaultConversation;
                const volunteerId = new mongoose_1.default.Types.ObjectId(id);
                const conversation = yield conversationModel_1.default.findByIdAndUpdate(defaultConversationId, { $addToSet: { participants: volunteerId } }, // Add volunteerId to participants
                { new: true });
                if (!conversation) {
                    throw new Error("Default conversation not found");
                }
                return true;
            }
            catch (error) {
                console.error(error);
                throw new Error("Failed to update volunteer details");
            }
        });
    }
    getVolunteers(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield communityModel_1.default.findById(id).populate('volunteers.volunteerId');
                if (data) {
                    const communityData = data.toObject();
                    const acceptedVolunteers = communityData.volunteers.filter((vol) => vol.is_accepted).map((vol) => vol.volunteerId);
                    return acceptedVolunteers;
                }
                return null;
            }
            catch (error) {
                console.error(error.message);
                throw new Error('unable to fetch list of volunteers');
            }
        });
    }
}
exports.default = communityRepository;
