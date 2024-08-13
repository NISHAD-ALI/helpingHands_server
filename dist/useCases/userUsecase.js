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
class userUseCases {
    constructor(userRepo, generateOtp, jwt, sendMailOtp, hashPassword, cloudinary, stripe) {
        this.userRepo = userRepo;
        this.generateOtp = generateOtp;
        this.jwt = jwt;
        this.sendMailOtp = sendMailOtp;
        this.hashPassword = hashPassword;
        this.cloudinary = cloudinary;
        this.stripe = stripe;
    }
    findUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let userExist = yield this.userRepo.findUserByEmail(userData.email);
                if (userExist) {
                    return { data: true };
                }
                else {
                    const otp = this.generateOtp.generateOTP();
                    console.log(otp);
                    let token = jsonwebtoken_1.default.sign({ userData, otp }, process.env.JWT_SECRET_KEY, { expiresIn: '10d' });
                    yield this.sendMailOtp.sendMail(userData.email, otp);
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
    saveUserDB(token, userOtp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let payload = this.jwt.verifyToken(token);
                if (payload) {
                    if (userOtp == payload.otp) {
                        let hashedPassword = yield this.hashPassword.hashPassword(payload.userData.password);
                        payload.userData.password = hashedPassword;
                        let newUser = yield this.userRepo.saveUser(payload.userData);
                        if (newUser) {
                            let token = this.jwt.generateToken(newUser._id, 'user');
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
                const userData = yield this.userRepo.findUserByEmail(email);
                if (userData) {
                    const isPasswordCorrect = yield this.hashPassword.comparePassword(password, userData.password);
                    if (!isPasswordCorrect) {
                        return {
                            success: false,
                            message: 'Incorrect Password'
                        };
                    }
                    if (userData.is_blocked) {
                        return {
                            success: false,
                            message: "You've been blocked by admin"
                        };
                    }
                    const accessToken = this.jwt.generateToken(userData._id, 'user');
                    const refreshToken = this.jwt.generateRefreshToken(userData._id, 'user');
                    return {
                        success: true,
                        token: accessToken,
                        refreshToken: refreshToken
                    };
                }
                else {
                    return {
                        success: false,
                        message: 'Email not found'
                    };
                }
            }
            catch (error) {
                console.error("Error during login:", error);
                throw error;
            }
        });
    }
    resendOtp(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let decoded = this.jwt.verifyToken(token);
                let newOtp = this.generateOtp.generateOTP();
                yield this.sendMailOtp.sendMail(decoded.userData.email, newOtp);
                console.log(newOtp);
                let userData = decoded.userData;
                let newToken = jsonwebtoken_1.default.sign({ userData, otp: newOtp }, process.env.JWT_SECRET_KEY, { expiresIn: '5m' });
                return newToken;
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    googleSignup(name, email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let exists = yield this.userRepo.findUserByEmail(email);
                if (exists) {
                    return { success: false, message: 'Email already exists' };
                }
                else {
                    const hashedPassword = yield this.hashPassword.hashPassword(password);
                    const saveUser = yield this.userRepo.saveUser({ name, email, password: hashedPassword });
                    if (saveUser) {
                        const accessToken = this.jwt.generateToken(saveUser._id, 'user');
                        const refreshToken = this.jwt.generateRefreshToken(saveUser._id, 'user');
                        return { success: true, token: accessToken, refreshToken };
                    }
                    else {
                        return { success: false, message: 'Internal server error' };
                    }
                }
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
                let exists = yield this.userRepo.findUserByEmail(email);
                if (!exists) {
                    return { success: false };
                }
                else {
                    const otp = this.generateOtp.generateOTP();
                    console.log(otp);
                    let token = jsonwebtoken_1.default.sign({ email, otp }, process.env.JWT_SECRET_KEY, { expiresIn: '10m' });
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
    changePassword(token, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let jwtVerify = this.jwt.verifyToken(token);
                let hashedPassword = yield this.hashPassword.hashPassword(password);
                const response = yield this.userRepo.changePassword(jwtVerify.email, hashedPassword);
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
                const userData = this.userRepo.findUserById(id);
                return userData;
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
                let response = yield this.userRepo.editUser(id, newData);
                console.log(response + "->api response");
                return response;
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    payDonation(amount, userId, donationId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.stripe.createCheckoutSession(amount);
                const data = yield this.userRepo.donation(amount, userId, donationId);
                if (data) {
                    return response;
                }
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
}
exports.default = userUseCases;
