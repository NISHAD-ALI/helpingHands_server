import nodemailer from 'nodemailer';
import InodeMailerInterface from '../../useCases/interfaces/InodeMailerInterface';
import dotenv from 'dotenv';

dotenv.config();

class SendMail implements InodeMailerInterface {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
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

  async sendMail(to: string, otp: string): Promise<any> {
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
      } else {
        console.log('OTP sent successfully!');
      }
    });
  }

  async reportPostMail(to: string, id: string): Promise<any> {
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
      } else {
        console.log('Notification sent successfully!');
      }
    });
  }
}

export default SendMail;
