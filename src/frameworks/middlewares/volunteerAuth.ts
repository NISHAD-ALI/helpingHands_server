import { NextFunction, Request, Response } from "express";
import Jwt from "../utils/jwtAuth";
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
        const token = req.cookies.volunteerToken;

        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized Access - No valid token" });
        }

        const decode = jwt.verifyToken(token);

        if (!decode || decode.role !== 'volunteer') {
            return res.status(401).json({ success: false, message: "Unauthorized Access - Invalid token" });
        }

        const volunteer = await volunteerRepo.findVolunteerById(decode.id);

        if (volunteer?.is_blocked) {
            return res.status(401).json({ success: false, message: "Volunteer is blocked by admin" });
        }

        req.volunteerId = decode.id;
        return next();

    } catch (error: any) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: "Session has expired, please log in again." });
        }
        return res.status(401).json({ success: false, message: "Unauthorized Access - Invalid token" });
    }
};

export default volunteerAuth;
