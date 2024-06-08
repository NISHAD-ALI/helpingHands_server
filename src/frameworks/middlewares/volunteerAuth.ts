import { NextFunction, Request, Response } from "express";
import Jwt from "../utils/jwtAuth";
import communityRepository from "../repositories/communityRepository";
import volunteerRepository from "../repositories/volunteerRepository";

const jwt = new Jwt();
const volunteerRepo = new volunteerRepository();

declare global {
    namespace Express {
        interface Request {
            volunteerId?: string;
        }
    }
}

const volunteerAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log('in volunteer Auth ');
        const token = req.cookies.volunteerToken;
        console.log(`${token}-1`);

        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized Access - No valid token" });
        }
        console.log("1");
        const decode = jwt.verifyToken(token);
        console.log(decode);
        if (decode && decode.role !== 'volunteer') {
            console.log("2");
            res.status(401).json({ success: false, message: "Unauthorised Access - No valid token" })
        }
        if (decode && decode.id) {
            console.log("3");
            const volunteer = await volunteerRepo.findVolunteerById(decode.id);
            console.log("finally")
            if (volunteer?.is_blocked) {
                return res.status(401).json({ success: false, message: "community is blocked by admin" });
            } else {
                req.volunteerId = decode.id;
                console.log(`${req.volunteerId} -- here`);
                return next();
            }
        } else {
            console.log("4");
            return res.status(401).json({ success: false, message: "Unauthorized Access - No valid token" });
        }
    } catch (error: any) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: "Session has expired, please log in again." });
        }
        console.log("5");
        return res.status(401).send({ success: false, message: "Unauthorized - Invalid token" });
    }
};

export default volunteerAuth;
