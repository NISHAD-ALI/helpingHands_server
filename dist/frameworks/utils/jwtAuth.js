"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class Jwt {
    constructor() {
        this.jwtSecret = process.env.JWT_SECRET_KEY || "";
        this.refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || "";
    }
    generateToken(id, role) {
        try {
            const payload = { id, role };
            const token = jsonwebtoken_1.default.sign(payload, this.jwtSecret, { expiresIn: '30m' });
            return token;
        }
        catch (error) {
            console.error('Error while generating token:', error);
            throw new Error('Failed to generate token');
        }
    }
    generateRefreshToken(id, role) {
        try {
            const payload = { id, role };
            const refreshToken = jsonwebtoken_1.default.sign(payload, this.refreshTokenSecret, { expiresIn: '6d' });
            return refreshToken;
        }
        catch (error) {
            console.error('Error while generating refresh token:', error);
            throw new Error('Failed to generate refresh token');
        }
    }
    verifyToken(token) {
        try {
            const verify = jsonwebtoken_1.default.verify(token, this.jwtSecret);
            console.log('Decoded token payload:', JSON.stringify(verify));
            return verify;
        }
        catch (error) {
            if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
                console.error('Token has expired:', error);
                throw new Error('Token has expired');
            }
            else if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                console.error('Invalid token:', error);
                throw new Error('Invalid token');
            }
            else {
                console.error('Error while verifying token:', error);
                throw new Error('Failed to verify token');
            }
        }
    }
    verifyRefreshToken(token) {
        try {
            const verify = jsonwebtoken_1.default.verify(token, this.refreshTokenSecret);
            console.log('Decoded refresh token payload:', JSON.stringify(verify));
            return verify;
        }
        catch (error) {
            if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
                console.error('Refresh token has expired:', error);
                throw new Error('Refresh token has expired');
            }
            else if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                console.error('Invalid refresh token:', error);
                throw new Error('Invalid refresh token');
            }
            else {
                console.error('Error while verifying refresh token:', error);
                throw new Error('Failed to verify refresh token');
            }
        }
    }
}
exports.default = Jwt;
