import { Request, Response } from "express";
import communityUsecase from "../useCases/communityUsecase";
import communityModel from "../frameworks/database/communityModel";
import community from "../entities/community";

class communityController {
    private communityUseCase: communityUsecase
    constructor(communityuseCase: communityUsecase) {
        this.communityUseCase = communityuseCase
    }
    async signup(req: Request, res: Response) {
        try {
            console.log('hello');

            const { email, name, password, phone } = req.body
            const commData = { email, name, password, phone }
            const exists = await this.communityUseCase.findCommunity(commData as community)
            console.log(exists)
            if (!exists.data) {
                const token = exists.token
                const user = await communityModel.findOne({ email: email });
                res.status(200).json({ success: true, token, username: user })
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
            let saveCommDB = this.communityUseCase.saveCommDB(token, otp)
            if ((await saveCommDB).success) {
                res.cookie('communityToken', (await saveCommDB).token, {
                    expires: new Date(Date.now() + 25892000000),
                    httpOnly: true
                })
                res.status(200).json(saveCommDB)
            } else {
                res.status(402).json({ success: false, message: (await saveCommDB).message })
            }
        } catch (error) {
            console.error(error)
            res.status(500).json({ success: false, message: 'Internal Server Error' })
        }
    }

    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body
            let checkUser = await this.communityUseCase.login(email, password)
            if (checkUser.success) {
                res.cookie('communityToken', checkUser.token, {
                    expires: new Date(Date.now() + 25892000000),
                    httpOnly: true
                })
                res.status(200).json({ success: true, token: checkUser.token })
            } else {
                console.log(checkUser.message)
                res.status(401).json({ success: false, message: checkUser.message })
            }
        } catch (error) {
            console.error(error)
            res.status(500).json({ success: false, message: "Internal server error" })
        }
    }
    async logout(req: Request, res: Response) {
        try {
            res.cookie('communityToken', '', {
                httpOnly: true,
                expires: new Date(0)
            })
            res.status(200).json({ success: true })
        } catch (error) {
            console.error(error)
            res.status(500).json({ success: false, message: "Internal server error" })
        }
    }

    async resendOtp(req: Request, res: Response) {
        try {
            let token = req.headers.authorization?.split(' ')[1] as string
            let newToken = await this.communityUseCase.resendOtp(token)
            res.status(200).json({ success: true, newToken });
        } catch (err) {
            res.status(500).json({ success: false, message: 'Internal server error!' });
        }
    }
    async getProfile(req:Request,res:Response){
        try {
            console.log('in get')
            let communityId = req.communityId
            console.log(req.communityId);
            
            if(communityId){
                let data = await this.communityUseCase.getProfile(communityId)
                res.status(200).json({ success: true,data })
            }else{
                res.status(402).json({ success: false, message: 'Failed to volunteer profile!' })
            }
        } catch (error) {
            res.status(500).json({ success: false, message: 'Internal server error!' });
        }
    }
    async editProfile(req:Request,res:Response){
        try {
            console.log("kk")
            const communityId = req.communityId
            console.log("in edit"+communityId)
            const newData = req.body
            console.log(newData)
            let profileImage = req.file
            console.log(profileImage)
            newData.profileImage = profileImage 
            if (communityId) {
                console.log("hi")
                let updated = await this.communityUseCase.editProfile(communityId, newData);
                if (updated) {
                    res.status(200).json({ success: true });
                } else {
                    res.status(500).json({ success: false, message: 'Cannot update community profile!' })
                }

            } else {
                res.status(401).json({ success: false, message: "Something went wrong!Try again!" })
            }
        } catch (error) {
            res.status(500).json({ success: false, message: 'Internal server error!' });
        }
    }
    async getCommunityById(req:Request,res:Response){
        try {
            const {id} = req.params
            console.log(id+"222222222222222");
            
            if (id) {
                let updated = await this.communityUseCase.getProfile(id);
                if (updated) {
                    res.status(200).json({ success: true ,updated });
                } else {
                    res.status(500).json({ success: false, message: 'Cannot get community profile!' })
                }

            } else {
                res.status(401).json({ success: false, message: "Something went wrong!Try again!" })
            }
        } catch (error) {
            res.status(500).json({ success: false, message: 'Internal server error!' });
        }
    }
    async updateStatus(req:Request,res:Response){
        try {
            const {id,is_accepted} = req.body
            console.log(id,is_accepted)
            const cId:any = req.communityId
            console.log(cId)
            if (id) {
                console.log("hi")
                let updated = await this.communityUseCase.updateStatus(id, is_accepted,cId);
                if (updated) {
                    res.status(200).json({ success: true });
                } else {
                    res.status(500).json({ success: false, message: 'Cannot update community profile!' })
                }

            } else {
                res.status(401).json({ success: false, message: "Something went wrong!Try again!" })
            }
        } catch (error) {
            res.status(500).json({ success: false, message: 'Internal server error!' });
        }
    }
    async getVolunteers(req:Request,res:Response){
        try {
            const communityId:any = req.communityId
            if (communityId) {
                let response = await this.communityUseCase.getVolunteers(communityId);
                if (response) {
                    res.status(200).json({ success: true ,response });
                } else {
                    res.status(500).json({ success: false, message: 'Cannot get community volunteers!' })
                }

            } else {
                res.status(401).json({ success: false, message: "Something went wrong!Try again!" })
            }
        } catch (error) {
            res.status(500).json({ success: false, message: 'Internal server error!' });
        }
    }
}

export default communityController