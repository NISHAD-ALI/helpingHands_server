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
const jwtAuth_1 = __importDefault(require("../utils/jwtAuth"));
const userRepository_1 = __importDefault(require("../repositories/userRepository"));
const jwt = new jwtAuth_1.default();
const userRepo = new userRepository_1.default();
const userAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accessToken = req.cookies.userToken;
        if (!accessToken) {
            return res.status(401).json({ success: false, message: "Unauthorized Access - No valid access token" });
        }
        const accessPayload = jwt.verifyToken(accessToken);
        if (!accessPayload || accessPayload.role !== 'user') {
            return res.status(401).json({ success: false, message: "Unauthorized Access - Invalid access token" });
        }
        const user = yield userRepo.findUserById(accessPayload.id);
        if (user === null || user === void 0 ? void 0 : user.is_blocked) {
            return res.status(401).json({ success: false, message: "User is blocked by admin" });
        }
        req.userId = accessPayload.id;
        return next();
    }
    catch (error) {
        if (error.name === 'Error') {
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) {
                return res.status(401).json({ success: false, message: "Session has expired, please log in again." });
            }
            const refreshPayload = jwt.verifyRefreshToken(refreshToken);
            if (!refreshPayload) {
                return res.status(401).json({ success: false, message: "Invalid refresh token" });
            }
            const newAccessToken = jwt.generateToken(refreshPayload.id, 'user');
            const newRefreshToken = jwt.generateRefreshToken(refreshPayload.id, 'user');
            res.cookie('userToken', newAccessToken, {
                expires: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
            });
            res.cookie('refreshUserToken', newRefreshToken, {
                expires: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000), // 6 days
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
            });
            req.userId = refreshPayload.id;
            return next();
        }
        return res.status(401).json({ success: false, message: "Unauthorized Access - Invalid token" });
    }
});
exports.default = userAuth;
