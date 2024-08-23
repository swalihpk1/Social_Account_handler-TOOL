import { CanActivate, Injectable, UnauthorizedException, ExecutionContext } from "@nestjs/common";
import { JwtConfigService } from "src/config/jwt/jwt.config";

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private jwtConfigService: JwtConfigService) { }
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const token = request.headers.authorization?.split(' ')[1]
        if (!token) {
            throw new UnauthorizedException('No token provided');
        }

        const decoded = this.jwtConfigService.verifyJwtToken(token)
        if (!decoded) {
            throw new UnauthorizedException('Invalid token')
        }

        request.user = decoded;
        return true;
    }
}