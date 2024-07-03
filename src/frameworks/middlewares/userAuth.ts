import { NextFunction, Request, Response } from "express";
import Jwt from "../utils/jwtAuth";
import userRepository from "../repositories/userRepository";

const jwt = new Jwt();
const userRepo = new userRepository();

declare global {
    namespace Express {
        interface Request {
            userId?: string;
        }
    }
}

const userAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.userToken;

        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized Access - No valid token" });
        }

        const decode = jwt.verifyToken(token);

        if (!decode || decode.role !== 'user') {
            return res.status(401).json({ success: false, message: "Unauthorized Access - Invalid token" });
        }

        const user = await userRepo.findUserById(decode.id);

        if (user?.is_blocked) {
            return res.status(401).json({ success: false, message: "User is blocked by admin" });
        }

        req.userId = decode.id;
        return next();

    } catch (error: any) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: "Session has expired, please log in again." });
        }
        return res.status(401).json({ success: false, message: "Unauthorized Access - Invalid token" });
    }
};

export default userAuth;
