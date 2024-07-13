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
const adminModel_1 = __importDefault(require("../database/adminModel"));
const communityModel_1 = __importDefault(require("../database/communityModel"));
const userModel_1 = __importDefault(require("../database/userModel"));
const donationModel_1 = __importDefault(require("../database/donationModel"));
const reportPostModel_1 = __importDefault(require("../database/reportPostModel"));
const volunteerModel_1 = __importDefault(require("../database/volunteerModel"));
const eventModel_1 = __importDefault(require("../database/eventModel"));
class adminRepository {
    findAdminByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield adminModel_1.default.findOne({ email: email });
                return data ? data.toObject() : null;
            }
            catch (error) {
                console.error(error.message);
                throw new Error('unable to fetch admin');
            }
        });
    }
    getCommunities() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield communityModel_1.default.find({}).populate('events');
                return data;
            }
            catch (error) {
                console.error(error.message);
                throw new Error('unable to fetch list of communities');
            }
        });
    }
    getUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield userModel_1.default.find({});
                return data;
            }
            catch (error) {
                console.error(error.message);
                throw new Error('unable to fetch list of users');
            }
        });
    }
    blockUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let user = yield userModel_1.default.findById(id);
                if (user) {
                    yield userModel_1.default.findByIdAndUpdate(id, { $set: { is_blocked: !user.is_blocked } });
                    return true;
                }
                else {
                    return false;
                }
            }
            catch (err) {
                console.log(err);
                throw new Error("Failed to block user");
            }
        });
    }
    blockCommunity(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let community = yield communityModel_1.default.findById(id);
                if (community) {
                    yield communityModel_1.default.findByIdAndUpdate(id, { $set: { is_blocked: !community.is_blocked } });
                    return true;
                }
                else {
                    return false;
                }
            }
            catch (err) {
                console.log(err);
                throw new Error("Failed to block community");
            }
        });
    }
    createDonation(donation) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let newDonation = new donationModel_1.default(donation);
                yield newDonation.save();
                return newDonation ? newDonation.toObject() : null;
            }
            catch (error) {
                console.error("Error creating donation:", error.message);
                throw new Error('Unable to create donation');
            }
        });
    }
    getDonations() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield donationModel_1.default.find({});
                return data;
            }
            catch (error) {
                console.error(error.message);
                throw new Error('unable to fetch list of donations');
            }
        });
    }
    getAllReports() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield reportPostModel_1.default
                    .find({})
                    .populate('postId')
                    .populate('reportedUsers.userId');
                console.log(data);
                return data;
            }
            catch (error) {
                console.error(error.message);
                throw new Error('Unable to fetch list of reports');
            }
        });
    }
    getAllVolunteeers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield volunteerModel_1.default
                    .find({});
                return data;
            }
            catch (error) {
                console.error(error.message);
                throw new Error('Unable to fetch list of volunteers');
            }
        });
    }
    getEvents() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield eventModel_1.default
                    .find({});
                return data;
            }
            catch (error) {
                console.error(error.message);
                throw new Error('Unable to fetch list of events');
            }
        });
    }
    deleteDonation(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let donation = yield donationModel_1.default.deleteOne({ _id: id });
                return donation.acknowledged;
            }
            catch (error) {
                console.error(error.message);
                throw new Error('unable to delete donation');
            }
        });
    }
}
exports.default = adminRepository;
