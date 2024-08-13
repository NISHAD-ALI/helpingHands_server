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
class communityUsecase {
    constructor(communityRepo, generateOtp, jwt, sendMailOtp, hashPassword, cloudinary) {
        this.communityRepo = communityRepo;
        this.generateOtp = generateOtp;
        this.jwt = jwt;
        this.sendMailOtp = sendMailOtp;
        this.hashPassword = hashPassword;
        this.cloudinary = cloudinary;
    }
    findCommunity(commData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let exists = yield this.communityRepo.findCommunityByEmail(commData.email);
                if (exists) {
                    return {
                        data: true
                    };
                }
                else {
                    const otp = this.generateOtp.generateOTP();
                    console.log(otp);
                    let token = jsonwebtoken_1.default.sign({ commData, otp }, process.env.JWT_SECRET_KEY, { expiresIn: '10d' });
                    yield this.sendMailOtp.sendMail(commData.email, otp);
                    return {
                        data: false,
                        token: token
                    };
                }
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    saveCommDB(token, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let payload = this.jwt.verifyToken(token);
                console.log((payload === null || payload === void 0 ? void 0 : payload.commData) + "payload");
                if (payload) {
                    if (otp === payload.otp) {
                        let hashedPassword = yield this.hashPassword.hashPassword(payload.commData.password);
                        payload.commData.password = hashedPassword;
                        let newCommunity = yield this.communityRepo.saveCommunity(payload.commData);
                        if (newCommunity) {
                            let token = this.jwt.generateToken(newCommunity._id, 'community');
                            return { success: true, token };
                        }
                        else {
                            return { success: true, message: 'Internal server error' };
                        }
                    }
                    else {
                        return { success: false, message: "incorrect OTP" };
                    }
                }
                else {
                    return { success: false, message: 'No token' };
                }
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield this.communityRepo.findCommunityByEmail(email);
                if (data) {
                    let verifyPassword = yield this.hashPassword.comparePassword(password, data.password);
                    if (!verifyPassword) {
                        return { success: false, message: 'Incorrect Password' };
                    }
                    else if (data.is_blocked) {
                        return {
                            success: false,
                            message: "You've Been blocked by admin"
                        };
                    }
                    else {
                        let token = this.jwt.generateToken(data._id, 'community');
                        console.log(token);
                        return {
                            success: true,
                            token: token
                        };
                    }
                }
                else {
                    return {
                        success: false,
                        message: 'Email not Found'
                    };
                }
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    resendOtp(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let decodedToken = this.jwt.verifyToken(token);
                let newOtp = this.generateOtp.generateOTP();
                let communityData = decodedToken.commData;
                let newToken = jsonwebtoken_1.default.sign({ communityData, otp: newOtp }, process.env.JWT_SECRET_KEY, { expiresIn: '5m' });
                return newToken;
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
                const communityData = this.communityRepo.findCommunityById(id);
                return communityData;
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
                let response = yield this.communityRepo.editCommunity(id, newData);
                console.log(response + "->api response");
                return response;
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    updateStatus(id, is_accepted, communityId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let response = yield this.communityRepo.updateStatus(id, is_accepted, communityId);
                console.log(response + "->api response");
                return response;
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    getVolunteers(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = this.communityRepo.getVolunteers(id);
                return data;
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
}
exports.default = communityUsecase;
