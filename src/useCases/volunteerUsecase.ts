import volunteer from "../entities/volunteer";
import IVolunteerInterface from "./interfaces/IVolunteerInterface";
import OtpGenerator from "../frameworks/utils/otpGenerator";
import jwt, { JwtPayload } from 'jsonwebtoken';
import Jwt from "../frameworks/utils/jwtAuth";
import SendMail from "../frameworks/utils/mailGenerator";
import HashPassword from "../frameworks/utils/hashedPassword";
import Cloudinary from "../frameworks/utils/cloudinary";


class volunteerUseCases {
    private volunteerRepo: IVolunteerInterface;
    private generateOtp: OtpGenerator;
    private jwt: Jwt
    private sendMailOtp: SendMail
    private hashPassword: HashPassword
    private cloudinary: Cloudinary
    constructor(volunteerRepo: IVolunteerInterface, generateOtp: OtpGenerator, jwt: Jwt, sendMailOtp: SendMail, hashPassword: HashPassword, cloudinary: Cloudinary) {
        this.volunteerRepo = volunteerRepo
        this.generateOtp = generateOtp
        this.jwt = jwt
        this.sendMailOtp = sendMailOtp
        this.hashPassword = hashPassword
        this.cloudinary = cloudinary
    }
    async findVolunteer(volunteerData: volunteer) {
        try {
            let volunteerExist = await this.volunteerRepo.findvolunteerByEmail(volunteerData.email)
            if (volunteerExist) {
                return { data: true }
            } else {
                const otp = this.generateOtp.generateOTP();
                console.log(otp)
                let token = jwt.sign({ volunteerData, otp }, process.env.JWT_SECRET_KEY as string, { expiresIn: '10d' });
                await this.sendMailOtp.sendMail(volunteerData.email, otp)

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
    async saveVolunteerDB(token: string, volunteerOtp: string) {
        try {
            let payload = this.jwt.verifyToken(token)
            if (payload) {
                if (volunteerOtp == payload.otp) {
                    let hashedPassword = await this.hashPassword.hashPassword(payload.volunteerData.password)
                    console.log(hashedPassword)
                    payload.volunteerData.password = hashedPassword;
                    let volunteer: any = await this.volunteerRepo.saveVolunteer(payload.volunteerData);
                    console.log(volunteer)
                    if (volunteer) {
                        let token = this.jwt.generateToken(volunteer._id, 'volunteer');
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
            let data = await this.volunteerRepo.findvolunteerByEmail(email)
            console.log(data)
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
                    let token = this.jwt.generateToken(data._id, 'volunteer')
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
            let volunteerData = decoded.volunteerData
            let newToken = jwt.sign({ volunteerData, otp: newOtp }, process.env.JWT_SECRET_KEY as string, { expiresIn: '5m' })
            return newToken;
        } catch (error) {
            console.error(error)
            throw error
        }
    }
    // async googleSignup(name: string, email: string, password: string) {
    //     try {
    //         console.log('in g sign');

    //         let exists = await this.volunteerRepo.findvolunteerByEmail(email)
    //         if (exists) {
    //             return { success: false, mesaage: 'Email already Exists' }
    //         } else {
    //             const hashedPassword = await this.hashPassword.hashPassword(password)
    //             const savevolunteer = await this.volunteerRepo.savevolunteer({ name, email, password: hashedPassword } as volunteer)
    //             if (savevolunteer) {
    //                 const token = this.jwt.generateToken(savevolunteer._id, 'volunteer')
    //                 return { success: true, token }
    //             } else {
    //                 return { success: false, message: 'Internal Server Error' }
    //             }
    //         }
    //     } catch (error) {
    //         console.error(error)
    //         throw error
    //     }

    // }
    async forgetPassword(email: string) {
        try {
            let exists = await this.volunteerRepo.findvolunteerByEmail(email)
            if (!exists) {
                return { success: false }
            } else {
                const otp = this.generateOtp.generateOTP();
                console.log(otp)
                let token = jwt.sign({ email, otp }, process.env.JWT_SECRET_KEY as string, { expiresIn: '10d' });
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
            const response = await this.volunteerRepo.changePassword(jwtVerify.email, hashedPassword)
            return response
        } catch (error) {
            console.error(error)
            throw error
        }
    }
    async getProfile(id: string) {
        try {
            const volunteerData = this.volunteerRepo.findVolunteerById(id)
            return volunteerData
        } catch (error) {
            console.error(error)
            throw error
        }
    }
    async editProfile(id: string, newData: volunteer) {
        try {
            let uploadFile = await this.cloudinary.uploadToCloud(newData.profileImage)
            newData.profileImage = uploadFile
            let response = await this.volunteerRepo.editVolunteer(id, newData);
            console.log(response + "->api response")
            return response
        } catch (error) {
            console.error(error)
            throw error
        }
    }

}

export default volunteerUseCases