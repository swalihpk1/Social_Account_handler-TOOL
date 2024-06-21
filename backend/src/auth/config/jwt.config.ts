import { Injectable } from "@nestjs/common";
import * as jwt from 'jsonwebtoken'


@Injectable()
export class JwtConfigService {
    private readonly secretKey = process.env.SECRET_KEY_JWT

    generateJwtToken(payload: any): string {
        return jwt.sign(payload, this.secretKey, { expiresIn: '24h' })
    }

    verifyJwtToken(token: string): any {
        try {
            const decoded = jwt.verify(token, this.secretKey);
            return decoded;
        } catch (error) {
            return null;
        }
    }
}
