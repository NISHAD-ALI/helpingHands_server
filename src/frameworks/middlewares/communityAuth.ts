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
        console.log('in community Auth ');
        const token = req.cookies.communityToken;
        console.log(`${token}-1`);

        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized Access - No valid token" });
        }
        console.log("1");
        const decode = jwt.verifyToken(token);
        console.log(decode);
        if (decode && decode.role !== 'community') {
            console.log("2");
            res.status(401).json({ success: false, message: "Unauthorised Access - No valid token" })
        }
        if (decode && decode.id) {
            console.log("3");
            const community = await communityRepo.findCommunityById(decode.id);
            console.log("finally")
            if (community?.is_blocked) {
                return res.status(401).json({ success: false, message: "community is blocked by admin" });
            } else {
                req.communityId = decode.id;
                console.log(`${req.communityId} -- here`);
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

export default communityAuth;
