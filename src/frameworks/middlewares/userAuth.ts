import { NextFunction, Request, Response } from "express";
import Jwt from "../utils/jwtAuth";
import userRepository from "../repositories/userRepository";
const jwt = new Jwt()
const userRepo = new userRepository()

declare global {
    namespace Express {
        interface Request {
            userId?: string
        }
    }
}

const userAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let token = req.cookies.userToken;
        if (!token) {
            res.status(401).json({ success: false, message: "Unauthorised Access - No valid token" })
        }
        const decode = jwt.verifyToken(token)
        if(decode && decode.role !== 'user'){
            res.status(401).json({ success: false, message: "Unauthorised Access - No valid token" })
        }
        if(decode && decode.Id){
            let user = await userRepo.findUserById(decode.Id)
            if(user?.is_blocked){
                res.status(401).json({success:false,message:"User is blocked by admin"})
            }else{
                req.userId = decode.Id
                next();
            }
        }else{
            res.status(401).json({ success: false, message: "Unauthorised Access - No valid token" })
        }
       
    } catch (error : any) {
        if(error.name==='TokenExpiredError'){
            return res.status(401).json({ success: false, message: "Session has expired, please log in again." });
        }
        return res.status(401).send({success:false,message:"Unauthorized - Invalid token"})
    }
    }

}