import { NextFunction, Request, Response } from "express";
import Jwt from "../utils/jwtAuth";
import communityRepository from "../repositories/communityRepository";

const jwt = new Jwt();
const communityRepo = new communityRepository();

declare global {
    namespace Express {
        interface Request {
            communityId?: string;
        }
    }
}

const communityAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.communityToken;

        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized Access - No valid token" });
        }
        const decode = jwt.verifyToken(token);

        if (!decode || decode.role !== 'community') {
            return res.status(401).json({ success: false, message: "Unauthorized Access - Invalid token" });
        }

        const community = await communityRepo.findCommunityById(decode.id);

        if (community?.is_blocked) {
            return res.status(401).json({ success: false, message: "Community is blocked by admin" });
        }

        req.communityId = decode.id;
        return next();

    } catch (error: any) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: "Session has expired, please log in again." });
        }
        return res.status(401).json({ success: false, message: "Unauthorized Access - Invalid token" });
    }
};

export default communityAuth;
