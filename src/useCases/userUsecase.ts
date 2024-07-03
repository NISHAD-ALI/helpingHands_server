import user from "../entities/user";
import IUserInterface from "./interfaces/IUserInterface";
import OtpGenerator from "../frameworks/utils/otpGenerator";
import jwt, { JwtPayload } from 'jsonwebtoken';
import Jwt from "../frameworks/utils/jwtAuth";
import SendMail from "../frameworks/utils/mailGenerator";
import HashPassword from "../frameworks/utils/hashedPassword";
import Cloudinary from "../frameworks/utils/cloudinary";
import stripePayment from "../frameworks/utils/stripe";

class userUseCases {
    private userRepo: IUserInterface;
    private generateOtp: OtpGenerator;
    private jwt: Jwt
    private sendMailOtp: SendMail
    private hashPassword: HashPassword
    private cloudinary: Cloudinary
    private stripe:stripePayment
    constructor(userRepo: IUserInterface, generateOtp: OtpGenerator, jwt: Jwt, sendMailOtp: SendMail, hashPassword: HashPassword, cloudinary: Cloudinary,stripe:stripePayment) {
        this.userRepo = userRepo
        this.generateOtp = generateOtp
        this.jwt = jwt
        this.sendMailOtp = sendMailOtp
        this.hashPassword = hashPassword
        this.cloudinary = cloudinary
        this.stripe = stripe
    }
    async findUser(userData: user) {
        try {
            let userExist = await this.userRepo.findUserByEmail(userData.email)
            if (userExist) {
                return { data: true }
            } else {
                const otp = this.generateOtp.generateOTP();
                console.log(otp)
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
    async login(email: string, password: string) {
        try {
            let data = await this.userRepo.findUserByEmail(email)
            if (data) {
                let checkPassword = await this.hashPassword.comparePassword(password, data.password)
                if (!checkPassword) {
                    return {
                        success: false,
                        message: 'Incorrect Password'
                    }
                } else if (data.is_blocked) {
                    return {
                        success: false,
                        message: "You've been blocked by admin"
                    }
                } else {
                    let token = this.jwt.generateToken(data._id, 'user')
                    return {
                        success: true,
                        token: token
                    }
                }
            } else {
                return {
                    success: false,
                    message: 'Email not found'
                }
            }
        } catch (error) {
            console.error(error)
            throw error
        }
    }
    async resendOtp(token: string) {
        try {
            let decoded = this.jwt.verifyToken(token) as JwtPayload;
            let newOtp = this.generateOtp.generateOTP()
            console.log(newOtp);
            let userData = decoded.userData
            let newToken = jwt.sign({ userData, otp: newOtp }, process.env.JWT_SECRET_KEY as string, { expiresIn: '5m' })
            return newToken;
        } catch (error) {
            console.error(error)
            throw error
        }
    }
    async googleSignup(name: string, email: string, password: string) {
        try {
            let exists = await this.userRepo.findUserByEmail(email)
            if (exists) {
                return { success: false, mesaage: 'Email already Exists' }
            } else {
                const hashedPassword = await this.hashPassword.hashPassword(password)
                const saveUser = await this.userRepo.saveUser({ name, email, password: hashedPassword } as user)
                if (saveUser) {
                    const token = this.jwt.generateToken(saveUser._id, 'user')
                    return { success: true, token }
                } else {
                    return { success: false, message: 'Internal Server Error' }
                }
            }
        } catch (error) {
            console.error(error)
            throw error
        }

    }
    async forgetPassword(email: string) {
        try {
            let exists = await this.userRepo.findUserByEmail(email)
            if (!exists) {
                return { success: false }
            } else {
                const otp = this.generateOtp.generateOTP();
                console.log(otp)
                let token = jwt.sign({ email, otp }, process.env.JWT_SECRET_KEY as string, { expiresIn: '10m' });
                await this.sendMailOtp.sendMail(email, otp)
                return { success: true, token }
            }
        } catch (error) {
            console.error(error)
            throw error
        }
    }
    async forgetPasswordOtpVerification(token: string, otp: string) {
        try {
            let jwtDecoded = this.jwt.verifyToken(token) as JwtPayload
            if (jwtDecoded.otp !== otp) {
                return false
            } else {
                return true
            }
        } catch (error) {
            console.error(error)
            throw error
        }
    }
    async changePassword(token: string, password: string) {
        try {
            let jwtVerify = this.jwt.verifyToken(token) as JwtPayload
            let hashedPassword = await this.hashPassword.hashPassword(password)
            const response = await this.userRepo.changePassword(jwtVerify.email, hashedPassword)
            return response
        } catch (error) {
            console.error(error)
            throw error
        }
    }
    async getProfile(id: string) {
        try {
            const userData = this.userRepo.findUserById(id)
            return userData
        } catch (error) {
            console.error(error)
            throw error
        }
    }
    async editProfile(id: string, newData: user) {
        try {
            let uploadFile = await this.cloudinary.uploadImageToCloud(newData.profileImage)
            newData.profileImage = uploadFile
            let response = await this.userRepo.editUser(id, newData);
            console.log(response + "->api response")
            return response
        } catch (error) {
            console.error(error)
            throw error
        }
    }
    async payDonation(amount :any,userId:string,donationId:string) {
        try {
            const response = await this.stripe.createCheckoutSession(amount);
            const data = await this.userRepo.donation(amount,userId,donationId)
            if(data){

                return response
            }
        } catch (error) {
            console.error(error)
            throw error
        }
    }

}

export default userUseCases