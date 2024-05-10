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
            if (!exists.data) {
                const token = exists.token
                res.status(200).json({ success: true, token })
            } else {
                res.send(409).json({ success: false, message: 'User already Exists' })
            }
        } catch (error) {
            console.error(error)
            res.send(500).json({ success: false, message: 'Internal Sever Error' })
        }
    }
    async saveToDb(req: Request, res: Response) {
        try {
            let token = req.headers.authorization?.split(' ')[1] as string
            let otp = req.body.otp
            let saveUserDB = this.userUsecase.saveUserDB(otp, token)
            if ((await saveUserDB).success) {
                res.cookie('userToken', (await saveUserDB).token, {
                    expires: new Date(Date.now() + 25892000000),
                    httpOnly: true
                })
                res.status(200).json(saveUserDB)
            }
            else {
                res.status(402).json({ success: false, message: (await saveUserDB).message })
            }
        } catch (error) {
            console.error(error)
            throw error
        }
    }
    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body
        let checkUser = this.userUsecase.login(email, password)
        if ((await checkUser).success) {
            res.cookie('userToken', (await checkUser).token, {
                expires: new Date(Date.now() + 25892000000),
                httpOnly: true
        })
        
        res.status(200).json({success:true,token:(await checkUser).token})
        }else{
            res.status(401).json({success:false,message:(await checkUser).message})
        }
    
        } catch (error) {
            console.error(error)
            throw error
        }
    }
}

export default UserController