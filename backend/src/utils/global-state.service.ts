import { Injectable } from '@nestjs/common';

@Injectable()
export class GlobalStateService {
    private userId: string;

    setUserId(userId: string) {
        this.userId = userId;
    }

    getUserId(): string {
        return this.userId;
    }
}
