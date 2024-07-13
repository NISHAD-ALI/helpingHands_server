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
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
console.log(process.env.EMAIL);
class SendMail {
    constructor() {
        this.transporter = nodemailer_1.default.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            },
        });
    }
    sendMail(to, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            const mailOptions = {
                from: process.env.EMAIL,
                to,
                subject: 'Sign up Verification',
                html: `<p>Hi </p>${to}<p>Your OTP is: <strong>${otp}</strong><br><br><br>regards,<br><b>TEAM helpingHands<b></p>`,
            };
            this.transporter.sendMail(mailOptions, (err) => {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log('OTP sent successfully!');
                }
            });
        });
    }
    reportPostMail(to, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const mailOptions = {
                from: process.env.EMAIL,
                to,
                subject: 'Removal of Post',
                html: `<p>Hi </p>${to}<p>Your Post <strong>${id}</strong> has been Removed because it does not follow community policy <br><br><br>regards,<br><b>TEAM helpingHands<b></p>`,
            };
            this.transporter.sendMail(mailOptions, (err) => {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log('OTP sent successfully!');
                }
            });
        });
    }
}
exports.default = SendMail;
