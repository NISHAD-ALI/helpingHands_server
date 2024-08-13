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
const volunteerModel_1 = __importDefault(require("../frameworks/database/volunteerModel"));
class VolunteerController {
    constructor(volunteerUseCases) {
        this.volunteerUseCases = volunteerUseCases;
    }
    signup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, password, phone } = req.body;
                const volunteerData = { name, email, password, phone };
                const exists = yield this.volunteerUseCases.findVolunteer(volunteerData);
                if (!exists.data) {
                    const token = exists.token;
                    const volunteer = yield volunteerModel_1.default.findOne({ email: email });
                    res.status(200).json({ success: true, token, username: volunteer });
                }
                else {
                    res.status(409).json({ success: false, message: "Email already exists" });
                }
            }
            catch (error) {
                console.error(error);
                res.send(500).json({ success: false, message: 'Internal Sever Error' });
            }
        });
    }
    verifyOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                let token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
                let otp = req.body.otp;
                let saveToDB = this.volunteerUseCases.saveVolunteerDB(token, otp);
                if ((yield saveToDB).success) {
                    res.cookie('volunteerToken', (yield saveToDB).token, {
                        expires: new Date(Date.now() + 25892000000),
                        httpOnly: true,
                        secure: true,
                        sameSite: 'none',
                        path: '/',
                    });
                    res.status(200).json(saveToDB);
                }
                else {
                    res.status(402).json({ success: false, message: (yield saveToDB).message });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: 'Internal Server Error' });
            }
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                let checkVolunteer = yield this.volunteerUseCases.login(email, password);
                if (checkVolunteer.success) {
                    res.cookie('volunteerToken', checkVolunteer.token, {
                        expires: new Date(Date.now() + 25892000000),
                        httpOnly: true,
                        secure: true,
                        sameSite: 'none',
                        path: '/',
                    });
                    res.status(200).json({ success: true, token: checkVolunteer.token });
                }
                else {
                    res.status(401).json({ success: false, message: checkVolunteer.message });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                res.clearCookie('volunteerToken', {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'none',
                    path: '/',
                });
                res.status(200).json({ success: true });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    resendOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                let token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
                let newToken = yield this.volunteerUseCases.resendOtp(token);
                res.status(200).json({ success: true, newToken });
            }
            catch (err) {
                res.status(500).json({ success: false, message: 'Internal server error!' });
            }
        });
    }
    forgetPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const email = req.body.email;
                const exists = yield this.volunteerUseCases.forgetPassword(email);
                if (!exists.success) {
                    res.status(402).json({ success: false, message: 'volunteer does not exists' });
                }
                else {
                    res.status(200).json({ success: true, token: exists.token });
                }
            }
            catch (error) {
                res.status(500).json({ success: false, message: 'Internal server error!' });
            }
        });
    }
    forgotPasswordOtpVerification(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                let token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
                let otp = req.body.otp;
                let response = yield this.volunteerUseCases.forgetPasswordOtpVerification(token, otp);
                if (response) {
                    res.status(200).json({ success: true });
                }
                else {
                    res.status(402).json({ success: false, message: 'Incorrect OTP' });
                }
            }
            catch (error) {
                res.status(500).json({ success: false, message: 'Internal server error!' });
            }
        });
    }
    changePassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { password, id } = req.body;
                let response = yield this.volunteerUseCases.changePassword(password, id);
                if (response) {
                    res.status(200).json({ success: true });
                }
                else {
                    res.status(402).json({ success: false, message: 'Failed to change the password!' });
                }
            }
            catch (error) {
                res.status(500).json({ success: false, message: 'Internal server error!' });
            }
        });
    }
    getProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let volunteerId = req.volunteerId;
                if (volunteerId) {
                    let data = yield this.volunteerUseCases.getProfile(volunteerId);
                    res.status(200).json({ success: true, data });
                }
                else {
                    res.status(402).json({ success: false, message: 'Failed to volunteer profile!' });
                }
            }
            catch (error) {
                res.status(500).json({ success: false, message: 'Internal server error!' });
            }
        });
    }
    editProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const volunteerId = req.volunteerId;
                const newData = req.body;
                let profileImage = req.file;
                newData.profileImage = profileImage;
                if (volunteerId) {
                    let updated = yield this.volunteerUseCases.editProfile(volunteerId, newData);
                    if (updated) {
                        res.status(200).json({ success: true });
                    }
                    else {
                        res.status(500).json({ success: false, message: 'Cannot update volunteer profile!' });
                    }
                }
                else {
                    res.status(401).json({ success: false, message: "Something went wrong!Try again!" });
                }
            }
            catch (error) {
                res.status(500).json({ success: false, message: 'Internal server error!' });
            }
        });
    }
    enrollToCommunity(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { communityId, volunteerId } = req.body;
                if (volunteerId && communityId) {
                    let data = yield this.volunteerUseCases.enrollToCommunity(communityId, volunteerId);
                    res.status(200).json({ success: true, data });
                }
                else {
                    res.status(402).json({ success: false, message: 'Failed to volunteer profile!' });
                }
            }
            catch (error) {
                res.status(500).json({ success: false, message: 'Internal server error!' });
            }
        });
    }
    getVolunteerById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let ids = req.query.id;
                if (Array.isArray(ids)) {
                    let data = [];
                    for (let id of ids) {
                        let volunteerData = yield this.volunteerUseCases.findVolunteerById(id);
                        data.push(volunteerData);
                    }
                    res.status(200).json({ success: true, data });
                }
                else {
                    let id = ids;
                    if (id) {
                        let data = yield this.volunteerUseCases.findVolunteerById(id);
                        res.status(200).json({ success: true, data });
                    }
                    else {
                        res.status(402).json({ success: false, message: 'Failed to fetch volunteer profile!' });
                    }
                }
            }
            catch (error) {
                res.status(500).json({ success: false, message: 'Internal server error!' });
            }
        });
    }
    getEvents(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let volunteerId = req.volunteerId;
                if (volunteerId) {
                    let data = yield this.volunteerUseCases.getEvents(volunteerId);
                    res.status(200).json({ success: true, data });
                }
                else {
                    res.status(402).json({ success: false, message: 'Failed to volunteer!' });
                }
            }
            catch (error) {
                res.status(500).json({ success: false, message: 'Internal server error!' });
            }
        });
    }
    enrollToEvent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { eventId } = req.body;
                const volunteerId = req.volunteerId;
                if (volunteerId && eventId) {
                    let data = yield this.volunteerUseCases.enrollToEvent(volunteerId, eventId);
                    res.status(200).json({ success: true, data });
                }
                else {
                    res.status(402).json({ success: false, message: 'Failed to enroll to the selected event!' });
                }
            }
            catch (error) {
                res.status(500).json({ success: false, message: error.message || 'Failed to enroll to the selected event!' });
            }
        });
    }
    getNotEnrolledEvents(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let volunteerId = req.volunteerId;
                if (volunteerId) {
                    let data = yield this.volunteerUseCases.notEnrolledEvents(volunteerId);
                    res.status(200).json({ success: true, data });
                }
                else {
                    res.status(402).json({ success: false, message: 'Failed to volunteer!' });
                }
            }
            catch (error) {
                res.status(500).json({ success: false, message: 'Internal server error!' });
            }
        });
    }
    getEnrolledEvents(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let volunteerId = req.volunteerId;
                if (volunteerId) {
                    let data = yield this.volunteerUseCases.enrolledEvents(volunteerId);
                    res.status(200).json({ success: true, data });
                }
                else {
                    res.status(402).json({ success: false, message: 'Failed to volunteer!' });
                }
            }
            catch (error) {
                res.status(500).json({ success: false, message: 'Internal server error!' });
            }
        });
    }
}
exports.default = VolunteerController;
