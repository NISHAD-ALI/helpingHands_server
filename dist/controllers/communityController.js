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
const communityModel_1 = __importDefault(require("../frameworks/database/communityModel"));
class communityController {
    constructor(communityuseCase) {
        this.communityUseCase = communityuseCase;
    }
    signup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, name, password, phone } = req.body;
                const commData = { email, name, password, phone };
                const exists = yield this.communityUseCase.findCommunity(commData);
                console.log(exists);
                if (!exists.data) {
                    const token = exists.token;
                    const user = yield communityModel_1.default.findOne({ email: email });
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
                let token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
                let otp = req.body.otp;
                let saveCommDB = this.communityUseCase.saveCommDB(token, otp);
                if ((yield saveCommDB).success) {
                    res.cookie('communityToken', (yield saveCommDB).token, {
                        expires: new Date(Date.now() + 25892000000),
                        httpOnly: true,
                        secure: true,
                        sameSite: 'none',
                        path: '/',
                    });
                    res.status(200).json(saveCommDB);
                }
                else {
                    res.status(402).json({ success: false, message: (yield saveCommDB).message });
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
                let checkUser = yield this.communityUseCase.login(email, password);
                if (checkUser.success) {
                    res.cookie('communityToken', checkUser.token, {
                        expires: new Date(Date.now() + 25892000000),
                        httpOnly: true,
                        secure: true,
                        sameSite: 'none',
                        path: '/',
                    });
                    res.status(200).json({ success: true, token: checkUser.token });
                }
                else {
                    console.log(checkUser.message);
                    res.status(401).json({ success: false, message: checkUser.message });
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
                res.cookie('communityToken', '', {
                    httpOnly: true,
                    expires: new Date(0)
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
                let newToken = yield this.communityUseCase.resendOtp(token);
                res.status(200).json({ success: true, newToken });
            }
            catch (err) {
                res.status(500).json({ success: false, message: 'Internal server error!' });
            }
        });
    }
    getProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let communityId = req.communityId;
                if (communityId) {
                    let data = yield this.communityUseCase.getProfile(communityId);
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
                const communityId = req.communityId;
                const newData = req.body;
                let profileImage = req.file;
                newData.profileImage = profileImage;
                if (communityId) {
                    let updated = yield this.communityUseCase.editProfile(communityId, newData);
                    if (updated) {
                        res.status(200).json({ success: true });
                    }
                    else {
                        res.status(500).json({ success: false, message: 'Cannot update community profile!' });
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
    getCommunityById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                if (id) {
                    let updated = yield this.communityUseCase.getProfile(id);
                    if (updated) {
                        res.status(200).json({ success: true, updated });
                    }
                    else {
                        res.status(500).json({ success: false, message: 'Cannot get community profile!' });
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
    updateStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, is_accepted } = req.body;
                const cId = req.communityId;
                if (id) {
                    let updated = yield this.communityUseCase.updateStatus(id, is_accepted, cId);
                    if (updated) {
                        res.status(200).json({ success: true });
                    }
                    else {
                        res.status(500).json({ success: false, message: 'Cannot update community profile!' });
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
    getVolunteers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const communityId = req.communityId;
                if (communityId) {
                    let response = yield this.communityUseCase.getVolunteers(communityId);
                    if (response) {
                        res.status(200).json({ success: true, response, communityId });
                    }
                    else {
                        res.status(500).json({ success: false, message: 'Cannot get community volunteers!' });
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
}
exports.default = communityController;
