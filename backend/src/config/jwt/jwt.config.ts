import { Injectable } from "@nestjs/common";
import * as jwt from 'jsonwebtoken'


@Injectable()
export class JwtConfigService {
    private readonly secretKey = process.env.SECRET_KEY_JWT
    private readonly refreshSecretKey = process.env.SECRET_KEY_REFRESH_JWT;

    generateJwtToken(payload: any): string {
        return jwt.sign(payload, this.secretKey, { expiresIn: '12m' })
    }

    generateRefreshToken(payload: any): string {
        return jwt.sign(payload, this.refreshSecretKey, { expiresIn: '7d' });
    }

    verifyJwtToken(token: string): any {
        try {
            const decoded = jwt.verify(token, this.secretKey);
            return decoded;
        } catch (error) {
            return null;
        }
    }

    verifyRefreshToken(token: string): any {
        try {
            return jwt.verify(token, this.refreshSecretKey);
        } catch (error) {
            return null;
        }
    }
}
