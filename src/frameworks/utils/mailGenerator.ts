import nodemailer from 'nodemailer'
import InodeMailerInterface from '../../useCases/interfaces/InodeMailerInterface'
import dotenv from 'dotenv'
dotenv.config();
console.log(process.env.EMAIL)
class SendMail implements InodeMailerInterface{

    private transporter;
    constructor(){
        this.transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
              user: process.env.EMAIL,
              pass: process.env.PASSWORD
      
            },
        })
    }
    async sendMail(to: string, otp: string,): Promise<any> {
        const mailOptions = {
            from: process.env.EMAIL,
            to,
            subject: 'Sign up Verification',
            html: `<p>Hi </p>${to}<p>Your OTP is: <strong>${otp}</strong><br><br><br>regards,<br><b>TEAM helpingHands<b></p>`,
          };
       
      
          
        this.transporter.sendMail(mailOptions,(err)=>{
            if(err){
                console.log(err);
            }else{
                console.log('OTP sent successfully!')
            }
        });

       
    }
    async reportPostMail(to: string, id: string,): Promise<any> {
        const mailOptions = {
            from: process.env.EMAIL,
            to,
            subject: 'Removal of Post',
            html: `<p>Hi </p>${to}<p>Your Post <strong>${id}</strong> has been Removed because it does not follow community policy <br><br><br>regards,<br><b>TEAM helpingHands<b></p>`,
          };
       
      
          
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