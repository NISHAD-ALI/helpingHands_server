"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = () => {
    try {
        const mongoURL = process.env.MONGODB_URL;
        mongoose_1.default.connect(mongoURL);
        console.log("Database connected");
    }
    catch (error) {
        console.error('An error occurred while connecting the mongoDB:', error);
    }
};
exports.connectDB = connectDB;
exports.default = exports.connectDB;
