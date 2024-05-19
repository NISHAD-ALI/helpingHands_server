import { Request,Response } from "express";
import communityUsecase from "../useCases/communityUsecase";
import communityModel from "../frameworks/database/communityModel";
import community from "../entities/community";


class communityController{
    private communityUseCase : communityUsecase
    constructor(communityuseCase:communityUsecase){
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
            console.log(saveCommDB)
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
}

export default communityController