import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

class Jwt {
    private jwtSecret: string;
    private refreshTokenSecret: string;

    constructor() {
        this.jwtSecret = process.env.JWT_SECRET_KEY || "";
        this.refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || "";
    }

    generateToken(id: string, role: string): string {
        try {
            const payload = { id, role };
            const token = jwt.sign(payload, this.jwtSecret, { expiresIn: '1m' });
            return token;
        } catch (error) {
            console.error('Error while generating token:', error);
            throw new Error('Failed to generate token');
        }
    }

    generateRefreshToken(id: string, role: string): string {
        try {
            const payload = { id, role };
            const refreshToken = jwt.sign(payload, this.refreshTokenSecret, { expiresIn: '6d' });
            return refreshToken;
        } catch (error) {
            console.error('Error while generating refresh token:', error);
            throw new Error('Failed to generate refresh token');
        }
    }

    verifyToken(token: string): JwtPayload | null {
        try {
            const verify = jwt.verify(token, this.jwtSecret) as JwtPayload;
            console.log('Decoded token payload:', JSON.stringify(verify)); 
            return verify;
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                console.error('Token has expired:', error);
                throw new Error('Token has expired');
            } else if (error instanceof jwt.JsonWebTokenError) {
                console.error('Invalid token:', error);
                throw new Error('Invalid token');
            } else {
                console.error('Error while verifying token:', error);
                throw new Error('Failed to verify token');
            }
        }
    }

    verifyRefreshToken(token: string): JwtPayload | null {
        try {
            const verify = jwt.verify(token, this.refreshTokenSecret) as JwtPayload;
            console.log('Decoded refresh token payload:', JSON.stringify(verify)); 
            return verify;
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                console.error('Refresh token has expired:', error);
                throw new Error('Refresh token has expired');
            } else if (error instanceof jwt.JsonWebTokenError) {
                console.error('Invalid refresh token:', error);
                throw new Error('Invalid refresh token');
            } else {
                console.error('Error while verifying refresh token:', error);
                throw new Error('Failed to verify refresh token');
            }
        }
    }
}

export default Jwt;
