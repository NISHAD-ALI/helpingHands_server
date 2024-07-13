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
const volunteerRepository_1 = __importDefault(require("../repositories/volunteerRepository"));
const jwt = new jwtAuth_1.default();
const volunteerRepo = new volunteerRepository_1.default();
const volunteerAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.cookies.volunteerToken;
        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized Access - No valid token" });
        }
        const decode = jwt.verifyToken(token);
        if (!decode || decode.role !== 'volunteer') {
            return res.status(401).json({ success: false, message: "Unauthorized Access - Invalid token" });
        }
        const volunteer = yield volunteerRepo.findVolunteerById(decode.id);
        if (volunteer === null || volunteer === void 0 ? void 0 : volunteer.is_blocked) {
            return res.status(401).json({ success: false, message: "Volunteer is blocked by admin" });
        }
        req.volunteerId = decode.id;
        return next();
    }
    catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: "Session has expired, please log in again." });
        }
        return res.status(401).json({ success: false, message: "Unauthorized Access - Invalid token" });
    }
});
exports.default = volunteerAuth;
