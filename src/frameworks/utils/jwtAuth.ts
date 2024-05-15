import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

class Jwt {
    private jwtSecret: string;

    constructor() {
        this.jwtSecret = process.env.JWT_SECRET_KEY || "";
    }

    generateToken(id: string, role: string): string {
        try {
            const payload = { id, role };
            const token = jwt.sign(payload, this.jwtSecret, { expiresIn: '30d' });
            
            return token;
        } catch (error) {
            console.error('Error while generating token:', error);
            throw new Error('Failed to generate token');
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

}

export default Jwt;
