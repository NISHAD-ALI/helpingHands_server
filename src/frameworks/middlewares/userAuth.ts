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
        const accessToken = req.cookies.userToken;
        if (!accessToken) {
            return res.status(401).json({ success: false, message: "Unauthorized Access - No valid access token" });
        }

        const accessPayload = jwt.verifyToken(accessToken);

        if (!accessPayload || accessPayload.role !== 'user') {
            return res.status(401).json({ success: false, message: "Unauthorized Access - Invalid access token" });
        }

        const user = await userRepo.findUserById(accessPayload.id);

        if (user?.is_blocked) {
            return res.status(401).json({ success: false, message: "User is blocked by admin" });
        }

        req.userId = accessPayload.id;
        return next();

    } catch (error: any) {
        if (error.name === 'Error') {
            const refreshToken = req.cookies.refreshToken;

            if (!refreshToken) {
                return res.status(401).json({ success: false, message: "Session has expired, please log in again." });
            }

            const refreshPayload = jwt.verifyRefreshToken(refreshToken);

            if (!refreshPayload) {
                return res.status(401).json({ success: false, message: "Invalid refresh token" });
            }

            const newAccessToken = jwt.generateToken(refreshPayload.id, 'user');
            const newRefreshToken = jwt.generateRefreshToken(refreshPayload.id, 'user');

            res.cookie('userToken', newAccessToken, {
                expires: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
            });

            res.cookie('refreshUserToken', newRefreshToken, {
                expires: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000), // 6 days
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
            });

            req.userId = refreshPayload.id;
            return next();
        }

        return res.status(401).json({ success: false, message: "Unauthorized Access - Invalid token" });
    }
};


export default userAuth;
