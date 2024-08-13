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
const userModel_1 = __importDefault(require("../frameworks/database/userModel"));
class UserController {
    constructor(userUsecase) {
        this.userUsecase = userUsecase;
    }
    signup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, password, phone } = req.body;
                const userData = { name, email, password, phone };
                const exists = yield this.userUsecase.findUser(userData);
                console.log(exists);
                if (!exists.data) {
                    const token = exists.token;
                    const user = yield userModel_1.default.findOne({ email: email });
                    res.status(200).json({ success: true, token, username: user });
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
                const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
                const { otp } = req.body;
                if (!token || !otp) {
                    return res.status(400).json({ success: false, message: 'Missing token or OTP' });
                }
                const saveUserDB = yield this.userUsecase.saveUserDB(token, otp);
                if (saveUserDB.success) {
                    res.cookie('userToken', saveUserDB.token, {
                        expires: new Date(Date.now() + 25892000000), // 30 days
                        httpOnly: true,
                    });
                    return res.status(200).json(saveUserDB);
                }
                else {
                    return res.status(402).json({ success: false, message: saveUserDB.message });
                }
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({ success: false, message: 'Internal Server Error' });
            }
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const loginResult = yield this.userUsecase.login(email, password);
                if (loginResult.success) {
                    const { token, refreshToken } = loginResult;
                    res.cookie('userToken', token, {
                        expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
                        httpOnly: true,
                        secure: true,
                        sameSite: 'none',
                        path: '/',
                    });
                    res.cookie('refreshToken', refreshToken, {
                        expires: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000), // 6 days
                        httpOnly: true,
                        secure: true,
                        sameSite: 'none',
                        path: '/',
                    });
                    res.status(200).json({ success: true, token });
                }
                else {
                    console.log(loginResult.message);
                    res.status(401).json({ success: false, message: loginResult.message });
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
                res.clearCookie('userToken', {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'none',
                    path: '/',
                });
                res.clearCookie('refreshToken', {
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
                let newToken = yield this.userUsecase.resendOtp(token);
                res.status(200).json({ success: true, newToken });
            }
            catch (err) {
                res.status(500).json({ success: false, message: 'Internal server error!' });
            }
        });
    }
    googleAuth(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, password } = req.body;
                const saveUser = yield this.userUsecase.googleSignup(name, email, password);
                if (saveUser.success) {
                    res.cookie('userToken', saveUser.token, {
                        expires: new Date(Date.now() + 25892000000),
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: 'strict',
                        path: '/',
                    });
                    if (saveUser.refreshToken) {
                        res.cookie('refreshToken', saveUser.refreshToken, {
                            expires: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000), // 6 days
                            httpOnly: true,
                            secure: process.env.NODE_ENV === 'production',
                            sameSite: 'strict',
                            path: '/',
                        });
                    }
                    res.status(200).json({ success: true, token: saveUser.token });
                }
                else {
                    res.status(401).json({ success: false, message: saveUser.message });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    forgetPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const email = req.body.email;
                const exists = yield this.userUsecase.forgetPassword(email);
                if (!exists.success) {
                    res.status(402).json({ success: false, message: 'User does not exists' });
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
                let response = yield this.userUsecase.forgetPasswordOtpVerification(token, otp);
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
            var _a;
            try {
                let newPassword = req.body.password;
                let token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
                let response = yield this.userUsecase.changePassword(token, newPassword);
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
                let userId = req.userId;
                if (userId) {
                    let data = yield this.userUsecase.getProfile(userId);
                    res.status(200).json({ success: true, data });
                }
                else {
                    res.status(402).json({ success: false, message: 'Failed to user profile!' });
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
                const userId = req.userId;
                const newData = req.body;
                let profileImage = req.file;
                newData.profileImage = profileImage;
                if (userId) {
                    let updated = yield this.userUsecase.editProfile(userId, newData);
                    if (updated) {
                        res.status(200).json({ success: true });
                    }
                    else {
                        res.status(500).json({ success: false, message: 'Cannot update user profile!' });
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
    fundraiser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.userId;
                const { amount, donationId } = req.body;
                const sessionId = yield this.userUsecase.payDonation(amount, userId, donationId);
                res.status(200).json({ sessionId });
            }
            catch (error) {
                res.status(500).json({ success: false, message: 'Internal server error!' });
            }
        });
    }
}
exports.default = UserController;
