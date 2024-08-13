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
class SendMail {
    constructor() {
        this.transporter = nodemailer_1.default.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            },
        });
    }
    sendMail(to, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            const mailOptions = {
                from: `"HelpingHands" <${process.env.EMAIL}>`,
                to,
                subject: 'Sign up Verification - HelpingHands',
                html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <div style="text-align: center;">
            <img src="https://res.cloudinary.com/dxriwp8sx/image/upload/v1723219532/wewwewe_tkpzdz.png" alt="HelpingHands Logo" style="max-width: 200px; max-height: 50px; margin-bottom: 20px;" />
          </div>
          <p style="font-size: 18px; color: #333;"><strong>Hi,</strong></p>
          <p style="font-size: 16px; color: #555;"><strong>Your OTP for signing up with HelpingHands is:</strong></p>
          <p style="font-size: 24px; color: #22c55e; text-align: center;"><strong>${otp}</strong></p>
          <p style="font-size: 16px; color: #555;"><strong>Please enter this OTP to complete your sign-up process.</strong></p>
          <p style="font-size: 16px; color: #555;"><strong>If you did not request this, please ignore this email.</strong></p>
          <br>
          <p style="font-size: 16px; color: #333;"><strong>Best regards,<br><strong>Team HelpingHands</strong></p>
          <hr style="border-top: 1px solid #eee;">
          <p style="font-size: 12px; color: #aaa; text-align: center;"><strong>&copy; 2024 HelpingHands. All rights reserved.</strong></p>
        </div>
      `,
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
                from: `"HelpingHands" <${process.env.EMAIL}>`,
                to,
                subject: 'Post Removal Notification - HelpingHands',
                html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <div style="text-align: center;">
            <img src="https://res.cloudinary.com/dxriwp8sx/image/upload/v1723219532/wewwewe_tkpzdz.png" alt="HelpingHands Logo" style="max-width: 200px; max-height: 50px; margin-bottom: 20px;" />
          </div>
          <p style="font-size: 18px; color: #333;"><strong>Hi,</strong></p>
          <p style="font-size: 16px; color: #555;"><strong>We regret to inform you that your post with ID <strong>${id}</strong> has been removed for violating our community policies.</strong></p>
          <p style="font-size: 16px; color: #555;"><strong>Please review our policies and ensure your future posts align with our community guidelines.</strong></p>
          <br>
          <p style="font-size: 16px; color: #333;"><strong>Best regards,<br><strong>Team HelpingHands</strong></p>
          <hr style="border-top: 1px solid #eee;">
          <p style="font-size: 12px; color: #aaa; text-align: center;"><strong>&copy; 2024 HelpingHands. All rights reserved.</strong></p>
        </div>
      `,
            };
            this.transporter.sendMail(mailOptions, (err) => {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log('Notification sent successfully!');
                }
            });
        });
    }
}
exports.default = SendMail;
