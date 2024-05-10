import user from "../entities/user";
import IUserInterface from "./interfaces/IUserInterface";
import OtpGenerator from "../frameworks/utils/otpGenerator";
import jwt from 'jsonwebtoken';
import Jwt from "../frameworks/utils/jwtAuth";
import SendMail from "../frameworks/utils/mailGenerator";
import HashPassword from "../frameworks/utils/hashedPassword";


class userUseCases {
    private userRepo: IUserInterface;
    private generateOtp: OtpGenerator;
    private jwt: Jwt
    private sendMailOtp: SendMail
    private hashPassword :HashPassword
    constructor(userRepo: IUserInterface, generateOtp: OtpGenerator, jwt: Jwt, sendMailOtp: SendMail,hashPassword:HashPassword) {
        this.userRepo = userRepo
        this.generateOtp = generateOtp
        this.jwt = jwt
        this.sendMailOtp = sendMailOtp
        this.hashPassword = hashPassword
    }
    async findUser(userData: user) {
        try {
            let userExist = await this.userRepo.findUserByEmail(userData.email)
            if (userExist) {
                return { data: true }
            } else {
                const otp = this.generateOtp.generateOTP();
                let token = jwt.sign({ userData, otp }, process.env.JWT_SECRET_KEY as string, { expiresIn: '10d' });
                await this.sendMailOtp.sendMail(userData.email, otp)
                return {
                    data: false,
                    token: token
                }
            }
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
    async saveUserDB(token: string, userOtp: string) {
        try {
            let payload = this.jwt.verifyToken(token)
            if (payload) {
                if (userOtp == payload.otp) {
                    let hashedPassword = await this.hashPassword.hashPassword(payload.userData.password)
                    payload.userData.password = hashedPassword;
                    let newUser: any = await this.userRepo.saveUser(payload.userData);
                    if (newUser) {
                        let token = this.jwt.generateToken(newUser._id, 'user');
                        return { success: true, token };
                    } else {
                        return { success: false, message: "Internal server error!" }
                    }
                } else {
                    return { success: false, message: "Incorrect OTP!" }
                }
            } else {
                return { success: false, message: "No token!Try again!" }
            }

        } catch (err) {
            console.log(err);
            throw err;
        }
    }
    async login(email:string,password:string){
        try {
            let data = await this.userRepo.findUserByEmail(email)
            if(data){
                let checkPassword = await this.hashPassword.comparePassword(password,data.password)
                if(!checkPassword){
                    return{
                        success:false,
                        message:'Incorrect Password'
                    }
                }else if(data.is_blocked){
                    return{
                        success:false,
                        message:"You've been blocked by admin"
                    }
                }else{
                    let token = this.jwt.generateToken(data._id,'user')
                    return{
                        success:true,
                        token:token
                    }
                }

            }else{
                return{
                    success:false,
                    message:'Email not found'
                }
            }
        } catch (error) {
            console.error(error)
            throw error
        }
    }
}

export default userUseCases