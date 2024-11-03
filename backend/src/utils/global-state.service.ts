import { Injectable } from '@nestjs/common';
import { CustomException } from '../exceptions/custom.exception';

@Injectable()
export class GlobalStateService {
    private userId: string;

    setUserId(userId: string) {
        if (!userId) {
            throw new CustomException('User ID cannot be empty', 400);
        }
        this.userId = userId;
    }

    getUserId(): string {
        if (!this.userId) {
            throw new CustomException('User ID not set in global state', 401);
        }
        return this.userId;
    }

    clearUserId(): void {
        this.userId = null;
    }
}
