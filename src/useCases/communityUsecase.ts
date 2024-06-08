import community from "../entities/community";
import ICommunityInterface from "./interfaces/ICommunityInterface";
import OtpGenerator from "../frameworks/utils/otpGenerator";
import jwt, { JwtPayload } from 'jsonwebtoken'
import SendMail from "../frameworks/utils/mailGenerator";
import HashPassword from "../frameworks/utils/hashedPassword";
import Jwt from "../frameworks/utils/jwtAuth";
import Cloudinary from "../frameworks/utils/cloudinary";

class communityUsecase {
    private communityRepo: ICommunityInterface;
    private generateOtp: OtpGenerator;
    private jwt: Jwt
    private sendMailOtp: SendMail
    private hashPassword: HashPassword
    private cloudinary: Cloudinary
    constructor(communityRepo: ICommunityInterface, generateOtp: OtpGenerator, jwt: Jwt, sendMailOtp: SendMail, hashPassword: HashPassword,cloudinary: Cloudinary) {
        this.communityRepo = communityRepo
        this.generateOtp = generateOtp
        this.jwt = jwt
        this.sendMailOtp = sendMailOtp
        this.hashPassword = hashPassword
        this.cloudinary = cloudinary
    }
    async findCommunity(commData: community) {
        try {
            let exists = await this.communityRepo.findCommunityByEmail(commData.email)
            if (exists) {
                return {
                    data: true
                }
            } else {
                const otp = this.generateOtp.generateOTP()
                console.log(otp)
                let token = jwt.sign({ commData, otp }, process.env.JWT_SECRET_KEY as string, { expiresIn: '10d' });
                await this.sendMailOtp.sendMail(commData.email, otp)
                return {
                    data: false,
                    token: token
                }
            }
        } catch (error) {
            console.log(error)
            throw error
        }
    }
    async saveCommDB(token: string, otp: string) {
        try {
            let payload = this.jwt.verifyToken(token)
            console.log(payload?.commData+"payload");
            if (payload) {
                if (otp === payload.otp) {
                    let hashedPassword = await this.hashPassword.hashPassword(payload.commData.password)
                    payload.commData.password = hashedPassword
                    let newCommunity = await this.communityRepo.saveCommunity(payload.commData)
                    if (newCommunity) {
                        let token = this.jwt.generateToken(newCommunity._id, 'community')
                        return { success: true, token }
                    } else {
                        return { success: true, message: 'Internal server error' }
                    }
                } else {
                    return { success: false, message: "incorrect OTP" }
                }
            } else {
                return { success: false, message: 'No token' }
            }
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    async login(email: string, password: string) {
        try {
            let data = await this.communityRepo.findCommunityByEmail(email)
            if (data) {
                let verifyPassword = await this.hashPassword.comparePassword(password, data.password)
                if (!verifyPassword) {
                    return { success: false, message: 'Incorrect Password' }
                } else if (data.is_blocked) {
                    return {
                        success: false,
                        message: "You've Been blocked by admin"
                    }
                } else {
                    let token = this.jwt.generateToken(data._id, 'community')
                    console.log(token)
                    return {
                        success: true,
                        token: token
                    }
                }
            } else {
                return {
                    success: false,
                    message: 'Email not Found'
                }
            }
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    async resendOtp(token: string) {
        try {
            let decodedToken = this.jwt.verifyToken(token) as JwtPayload
            let newOtp = this.generateOtp.generateOTP()
            let communityData = decodedToken.commData
            let newToken = jwt.sign({ communityData, otp: newOtp }, process.env.JWT_SECRET_KEY as string, { expiresIn: '5m' })
            return newToken
        } catch (error) {
            console.error(error)
            throw error
        }
    }
    async getProfile(id: string) {
        try {
            const communityData = this.communityRepo.findCommunityById(id)
            return communityData
        } catch (error) {
            console.error(error)
            throw error
        }
    }
    async editProfile(id: string, newData: community) {
        try {
            let uploadFile = await this.cloudinary.uploadImageToCloud(newData.profileImage)
            newData.profileImage = uploadFile
            let response = await this.communityRepo.editCommunity(id, newData);
            console.log(response + "->api response")
            return response
        } catch (error) {
            console.error(error)
            throw error
        }
    }
    async updateStatus(id: string, is_accepted: boolean,communityId:string) {
        try {
            let response = await this.communityRepo.updateStatus(id, is_accepted,communityId);
            console.log(response + "->api response")
            return response
        } catch (error) {
            console.error(error)
            throw error
        }
    }
    async getVolunteers(id: string) {
        try {
            const data = this.communityRepo.getVolunteers(id)
            return data
        } catch (error) {
            console.error(error)
            throw error
        }
    }
}


export default communityUsecase