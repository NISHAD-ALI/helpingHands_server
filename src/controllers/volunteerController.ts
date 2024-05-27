import { Request, Response } from "express";
import volunteerUseCases from "../useCases/volunteerUsecase";
import volunteerModel from "../frameworks/database/volunteerModel";
import volunteer from "../entities/volunteer";

class VolunteerController {
    private volunteerUseCases: volunteerUseCases
    constructor(volunteerUseCases: volunteerUseCases) {
        this.volunteerUseCases = volunteerUseCases
    }

    async signup(req: Request, res: Response) {
        try {
            const { name, email, password, phone } = req.body
            const volunteerData = { name, email, password, phone }
            console.log("volunteerData:",volunteerData)
            const exists = await this.volunteerUseCases.findVolunteer(volunteerData as volunteer)
            console.log(exists)
            if (!exists.data) {
                const token = exists.token
                const volunteer = await volunteerModel.findOne({ email: email });
                res.status(200).json({ success: true, token, username: volunteer })
            } else {
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
            let saveToDB = this.volunteerUseCases.saveVolunteerDB(token,otp)
            if ((await saveToDB).success) {
                res.cookie('volunteerToken', (await saveToDB).token, {
                    expires: new Date(Date.now() + 25892000000),
                    httpOnly: true
                })
                res.status(200).json(saveToDB)
            } else {
                res.status(402).json({ success: false, message: (await saveToDB).message })
            }
        } catch (error) {
            console.error(error)
            res.status(500).json({ success: false, message: 'Internal Server Error' })
        }
    }

    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            let checkVolunteer = await this.volunteerUseCases.login(email,password)
            if (checkVolunteer.success) {
                res.cookie('volunteerToken', checkVolunteer.token, {
                    expires: new Date(Date.now() + 25892000000),
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    path: '/',
                });
                res.status(200).json({ success: true, token: checkVolunteer.token });
            } else {
                console.log(checkVolunteer.message);
                res.status(401).json({ success: false, message: checkVolunteer.message });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }
    
    async logout(req: Request, res: Response) {
        try {
            res.clearCookie('volunteerToken', {
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
            let newToken = await this.volunteerUseCases.resendOtp(token)
            res.status(200).json({ success: true, newToken });
        } catch (err) {
            res.status(500).json({ success: false, message: 'Internal server error!' });
        }
    }
    // async googleAuth(req: Request, res: Response) {
    //     try {
    //         const { name, email, password } = req.body;
    //         const saveUser = await this.userUsecase.googleSignup(name, email, password);
    
    //         if (saveUser.success) {
    //             res.cookie('volunteerToken', saveUser.token, {
    //                 expires: new Date(Date.now() + 25892000000),
    //                 httpOnly: true,
    //                 secure: process.env.NODE_ENV === 'production',
    //                 sameSite: 'strict',
    //                 path: '/',
    //             });
    
    //             res.status(200).json({ success: true, token: saveUser.token });
    //         } else {
    //             res.status(401).json({ success: false, message: saveUser.message });
    //         }
    //     } catch (error) {
    //         console.error(error);
    //         res.status(500).json({ success: false, message: "Internal server error" });
    //     }
    // }
    
    async forgetPassword(req: Request, res: Response) {
        try {
            const email = req.body.email
            const exists = await this.volunteerUseCases.forgetPassword(email)
            if (!exists.success) {
                res.status(402).json({ success: false, message: 'volunteer does not exists' })
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
            let response = await this.volunteerUseCases.forgetPasswordOtpVerification(token, otp)
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
            let response = await this.volunteerUseCases.changePassword(token,newPassword)
            if (response) {
                res.status(200).json({ success: true })
            } else {
                res.status(402).json({ success: false, message: 'Failed to change the password!' })
            }
        } catch (error) {
            res.status(500).json({ success: false, message: 'Internal server error!' });
        }
    }
    // async getProfile(req:Request,res:Response){
    //     try {
    //         console.log('in get')
    //         let volunteerId = req.volunteerId
    //         console.log(req.volunteerId);
            
    //         if(volunteerId){
    //             let data = await this.volunteerUseCases.getProfile(volunteerId)
    //             res.status(200).json({ success: true,data })
    //         }else{
    //             res.status(402).json({ success: false, message: 'Failed to user profile!' })
    //         }
    //     } catch (error) {
    //         res.status(500).json({ success: false, message: 'Internal server error!' });
    //     }
    // }
    // async editProfile(req:Request,res:Response){
    //     try {
    //         console.log("in edit")
    //         const userId = req.userId
    //         const newData = req.body
    //         let profileImage = req.file
    //         newData.profileImage = profileImage 
    //         if (userId) {
    //             let updated = await this.userUsecase.editProfile(userId, newData);
    //             if (updated) {
    //                 res.status(200).json({ success: true });
    //             } else {
    //                 res.status(500).json({ success: false, message: 'Cannot update user profile!' })
    //             }
    //         } else {
    //             res.status(401).json({ success: false, message: "Something went wrong!Try again!" })
    //         }
    //     } catch (error) {
    //         res.status(500).json({ success: false, message: 'Internal server error!' });
    //     }
    // }
}

export default VolunteerController