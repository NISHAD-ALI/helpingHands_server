import nodemailer from 'nodemailer'
import InodeMailerInterface from '../../useCases/interfaces/InodeMailerInterface'
import dotenv from 'dotenv'
dotenv.config();

class SendMail implements InodeMailerInterface{

    private transporter;
    constructor(){
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth:{
                user:process.env.EMAIL,
                pass:process.env.PASSWORD
            }
        })
    }
    async sendMail(to: string, otp: string): Promise<any> {
        const mailOptions = {
            from: process.env.EMAIL,
            to,
            subject: 'Verify Your Account',
            text: `Your OTP for email verification is ${otp}`
        }
        
        this.transporter.sendMail(mailOptions,(err)=>{
            if(err){
                console.log(err);
            }else{
                console.log('OTP sent successfully!')
            }
        });

       
    }
}

export default SendMail;