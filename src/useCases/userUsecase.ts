import user from "../entities/user";
import IUserInterface from "./interfaces/IUserInterface";
import otpGenerator from "../frameworks/utils/otpGenerator";
import jwt from 'jsonwebtoken';
import Jwt from "../frameworks/utils/jwtAuth";
class userUseCases{
   private userRepo : IUserInterface;
   private generateOtp : otpGenerator;
   private jwt:Jwt
   constructor(userRepo : IUserInterface,generateOtp : otpGenerator,jwt:Jwt){
    this.userRepo = userRepo
    this.generateOtp = generateOtp
    this.jwt = jwt
   }
   async findUser(userData: user) {
    try {
        let userExist = await this.userRepo.findUserByEmail(userData.email)
        if (userExist) {
            return { data: true }
        } else {
            const otp = this.generateOtp.generateOTP();
            console.log(otp);
            let token = jwt.sign({ userData, otp }, process.env. as string, { expiresIn: '5m' });
            await this.sendOtp.sendMail(userData.email, otp)
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
}

export default userUseCases