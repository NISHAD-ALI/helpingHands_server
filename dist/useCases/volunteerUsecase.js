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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class volunteerUseCases {
    constructor(volunteerRepo, generateOtp, jwt, sendMailOtp, hashPassword, cloudinary) {
        this.volunteerRepo = volunteerRepo;
        this.generateOtp = generateOtp;
        this.jwt = jwt;
        this.sendMailOtp = sendMailOtp;
        this.hashPassword = hashPassword;
        this.cloudinary = cloudinary;
    }
    findVolunteer(volunteerData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let volunteerExist = yield this.volunteerRepo.findvolunteerByEmail(volunteerData.email);
                if (volunteerExist) {
                    return { data: true };
                }
                else {
                    const otp = this.generateOtp.generateOTP();
                    console.log(otp);
                    let token = jsonwebtoken_1.default.sign({ volunteerData, otp }, process.env.JWT_SECRET_KEY, { expiresIn: '10d' });
                    yield this.sendMailOtp.sendMail(volunteerData.email, otp);
                    return {
                        data: false,
                        token: token
                    };
                }
            }
            catch (err) {
                console.log(err);
                throw err;
            }
        });
    }
    saveVolunteerDB(token, volunteerOtp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let payload = this.jwt.verifyToken(token);
                if (payload) {
                    if (volunteerOtp == payload.otp) {
                        let hashedPassword = yield this.hashPassword.hashPassword(payload.volunteerData.password);
                        console.log(hashedPassword);
                        payload.volunteerData.password = hashedPassword;
                        let volunteer = yield this.volunteerRepo.saveVolunteer(payload.volunteerData);
                        console.log(volunteer);
                        if (volunteer) {
                            let token = this.jwt.generateToken(volunteer._id, 'volunteer');
                            return { success: true, token };
                        }
                        else {
                            return { success: false, message: "Internal server error!" };
                        }
                    }
                    else {
                        return { success: false, message: "Incorrect OTP!" };
                    }
                }
                else {
                    return { success: false, message: "No token!Try again!" };
                }
            }
            catch (err) {
                console.log(err);
                throw err;
            }
        });
    }
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield this.volunteerRepo.findvolunteerByEmail(email);
                console.log(data);
                if (data) {
                    let checkPassword = yield this.hashPassword.comparePassword(password, data.password);
                    if (!checkPassword) {
                        return {
                            success: false,
                            message: 'Incorrect Password'
                        };
                    }
                    else if (data.is_blocked) {
                        return {
                            success: false,
                            message: "You've been blocked by admin"
                        };
                    }
                    else {
                        let token = this.jwt.generateToken(data._id, 'volunteer');
                        return {
                            success: true,
                            token: token
                        };
                    }
                }
                else {
                    return {
                        success: false,
                        message: 'Email not found'
                    };
                }
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    resendOtp(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let decoded = this.jwt.verifyToken(token);
                let newOtp = this.generateOtp.generateOTP();
                console.log(newOtp);
                let volunteerData = decoded.volunteerData;
                let newToken = jsonwebtoken_1.default.sign({ volunteerData, otp: newOtp }, process.env.JWT_SECRET_KEY, { expiresIn: '5m' });
                return newToken;
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    forgetPassword(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let exists = yield this.volunteerRepo.findvolunteerByEmail(email);
                if (!exists) {
                    return { success: false };
                }
                else {
                    const otp = this.generateOtp.generateOTP();
                    console.log(otp);
                    let token = jsonwebtoken_1.default.sign({ email, otp }, process.env.JWT_SECRET_KEY, { expiresIn: '10d' });
                    yield this.sendMailOtp.sendMail(email, otp);
                    return { success: true, token };
                }
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    forgetPasswordOtpVerification(token, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let jwtDecoded = this.jwt.verifyToken(token);
                if (jwtDecoded.otp !== otp) {
                    return false;
                }
                else {
                    return true;
                }
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    changePassword(password, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let hashedPassword = yield this.hashPassword.hashPassword(password);
                const response = yield this.volunteerRepo.changePassword(hashedPassword, id);
                return response;
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    getProfile(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const volunteerData = this.volunteerRepo.findVolunteerById(id);
                return volunteerData;
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    editProfile(id, newData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let uploadFile = yield this.cloudinary.uploadImageToCloud(newData.profileImage);
                newData.profileImage = uploadFile;
                let response = yield this.volunteerRepo.editVolunteer(id, newData);
                console.log(response + "->api response");
                return response;
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    enrollToCommunity(communityId, volunteerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const volunteerData = this.volunteerRepo.enrollToCommunity(communityId, volunteerId);
                return volunteerData;
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    findVolunteerById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = this.volunteerRepo.findVolunteerById(id);
                return data;
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    getEvents(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = this.volunteerRepo.findEvents(id);
                return data;
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    notEnrolledEvents(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = this.volunteerRepo.notEnrolledEvents(id);
                return data;
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    enrolledEvents(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = this.volunteerRepo.enrolledEvents(id);
                return data;
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    enrollToEvent(volunteerId, eventId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const addToEvent = yield this.volunteerRepo.enrollToEvents(volunteerId, eventId);
                return addToEvent;
            }
            catch (error) {
                console.error('Error in use case:', error.message);
                throw new Error(error.message);
            }
        });
    }
}
exports.default = volunteerUseCases;
