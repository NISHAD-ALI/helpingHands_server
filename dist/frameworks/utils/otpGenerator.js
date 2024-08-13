"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class OtpGenerator {
    generateOTP() {
        const otp = Math.floor(10000 + Math.random() * 90000);
        return otp.toString();
    }
}
exports.default = OtpGenerator;
