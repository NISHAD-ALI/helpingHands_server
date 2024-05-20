import { Request, Response } from "express";
import userUseCases from "../useCases/userUsecase";
import userModel from "../frameworks/database/userModel";
import user from "../entities/user";

class UserController {
    private userUsecase: userUseCases
    constructor(userUsecase: userUseCases) {
        this.userUsecase = userUsecase
    }

    async signup(req: Request, res: Response) {
        try {
            const { name, email, password, phone } = req.body
            const userData = { name, email, password, phone }
            console.log("userData:",userData)
            const exists = await this.userUsecase.findUser(userData as user)
            console.log(exists)
            if (!exists.data) {
                const token = exists.token
                const user = await userModel.findOne({ email: email });
                res.status(200).json({ success: true, token, username: user })
            } else {
                console.log("hi")
                res.status(409).json({ success: false, message: "Email already exists" });

            }
        } catch (error) {
            console.error(error)
            res.send(500).json({ success: false, message: 'Internal Sever Error' })
        }
    }

    async verifyOtp(req: Request, res: Response) {
        try {
            let token = req.headers.authorization?.split(' ')[1] as string
            let otp = req.body.otp
            let saveUserDB = this.userUsecase.saveUserDB(token, otp)
            console.log((await saveUserDB).token+"--------------------")
            if ((await saveUserDB).success) {
                console.log("oo")
                res.cookie('userToken', (await saveUserDB).token, {
                    expires: new Date(Date.now() + 25892000000),
                    httpOnly: true
                })
                res.status(200).json(saveUserDB)
            } else {
                res.status(402).json({ success: false, message: (await saveUserDB).message })
            }
        } catch (error) {
            console.error(error)
            res.status(500).json({ success: false, message: 'Internal Server Error' })
        }
    }

    async login(req: Request, res: Response) {
        try {
            console.log("inside");
            const { email, password } = req.body;
            let checkUser = await this.userUsecase.login(email, password);
            if (checkUser.success) {
                res.cookie('userToken', checkUser.token, {
                    expires: new Date(Date.now() + 25892000000),
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    path: '/',
                });
                res.status(200).json({ success: true, token: checkUser.token });
            } else {
                console.log(checkUser.message);
                res.status(401).json({ success: false, message: checkUser.message });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }
    
    async logout(req: Request, res: Response) {
        try {
            res.clearCookie('userToken', {
                httpOnly: true,
                path: '/',
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
            });
  
            res.status(200).json({ success: true });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }
    

    async resendOtp(req: Request, res: Response) {
        try {
            let token = req.headers.authorization?.split(' ')[1] as string
            let newToken = await this.userUsecase.resendOtp(token)
            res.status(200).json({ success: true, newToken });
        } catch (err) {
            res.status(500).json({ success: false, message: 'Internal server error!' });
        }
    }
    async googleAuth(req: Request, res: Response) {
        try {
            const { name, email, password } = req.body;
            const saveUser = await this.userUsecase.googleSignup(name, email, password);
    
            if (saveUser.success) {
                res.cookie('userToken', saveUser.token, {
                    expires: new Date(Date.now() + 25892000000),
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    path: '/',
                });
    
                res.status(200).json({ success: true, token: saveUser.token });
            } else {
                res.status(401).json({ success: false, message: saveUser.message });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }
    
    async forgetPassword(req: Request, res: Response) {
        try {
            const email = req.body.email
            const exists = await this.userUsecase.forgetPassword(email)
            if (!exists.success) {
                res.status(402).json({ success: false, message: 'User does not exists' })
            } else {
                res.status(200).json({ success: true, token: exists.token })
            }
        } catch (error) {
            res.status(500).json({ success: false, message: 'Internal server error!' });
        }
    }
    async forgotPasswordOtpVerification(req: Request, res: Response) {
        try {
            let token = req.headers.authorization?.split(' ')[1] as string
            let otp = req.body.otp
            let response = await this.userUsecase.forgetPasswordOtpVerification(token, otp)
            if (response) {
                res.status(200).json({ success: true })
            } else {
                res.status(402).json({ success: false, message: 'Incorrect OTP' })
            }
        } catch (error) {
            res.status(500).json({ success: false, message: 'Internal server error!' });
        }
    }
    async changePassword(req: Request, res: Response) {
        try {
            let newPassword = req.body.password
            let token = req.headers.authorization?.split(' ')[1] as string
            let response = await this.userUsecase.changePassword(token, newPassword)
            if (response) {
                res.status(200).json({ success: true })
            } else {
                res.status(402).json({ success: false, message: 'Failed to change the password!' })
            }
        } catch (error) {
            res.status(500).json({ success: false, message: 'Internal server error!' });
        }
    }
    async getProfile(req:Request,res:Response){
        try {
            console.log('in get')
            let userId = req.userId
            console.log(req.userId);
            
            if(userId){
                let data = await this.userUsecase.getProfile(userId)
                res.status(200).json({ success: true,data })
            }else{
                res.status(402).json({ success: false, message: 'Failed to user profile!' })
            }
        } catch (error) {
            res.status(500).json({ success: false, message: 'Internal server error!' });
        }
    }
    async editProfile(req:Request,res:Response){
        try {
            console.log("in edit")
            const userId = req.userId
            const newData = req.body
            let profileImage = req.file
            newData.profileImage = profileImage 
            if (userId) {
                let updated = await this.userUsecase.editProfile(userId, newData);
                if (updated) {
                    res.status(200).json({ success: true });
                } else {
                    res.status(500).json({ success: false, message: 'Cannot update user profile!' })
                }
            } else {
                res.status(401).json({ success: false, message: "Something went wrong!Try again!" })
            }
        } catch (error) {
            res.status(500).json({ success: false, message: 'Internal server error!' });
        }
    }
}

export default UserController