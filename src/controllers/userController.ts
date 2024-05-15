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
            const exists = await this.userUsecase.findUser(userData as user)
            console.log(exists)
            if (!exists.data) {
                const token = exists.token
                const user = await userModel.findOne({ email: email });
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
            let saveUserDB = this.userUsecase.saveUserDB(token, otp)
            console.log(saveUserDB)
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
            console.log("inside")
            const { email, password } = req.body
            let checkUser = await this.userUsecase.login(email, password)
            if (checkUser.success) {
                res.cookie('userToken', checkUser.token, {
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
            res.cookie('userToken', '', {
                httpOnly: true,
                expires: new Date(0)
            })
            res.status(200).json({ success: true })
        } catch (error) {
            console.error(error)
            res.status(500).json({ success: false, message: "Internal server error" })
        }
    }

    async resendOtp(req:Request,res:Response){
        try {
            let token = req.headers.authorization?.split(' ')[1] as string
            let newToken = await this.userUsecase.resendOtp(token)
            res.status(200).json({ success: true, newToken });
        } catch (err) {
            res.status(500).json({ success: false, message: 'Internal server error!' });
        }
    }
}

export default UserController