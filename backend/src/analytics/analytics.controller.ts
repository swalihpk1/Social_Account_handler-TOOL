import { Controller, Get } from "@nestjs/common";
import { AnalyticService } from "./analytics.service";
import { GlobalStateService } from "src/utils/global-state.service"; 

@Controller('analytics')
export class AnalyticsController {
    constructor(
        private readonly analyticService: AnalyticService,
        private readonly globalStateService: GlobalStateService,
    ) { }

    @Get()
    async getAllAnalytics() {
        const userId = this.globalStateService.getUserId();
        if (!userId) {
            throw new Error('User ID is not defined.');
        }
        return await this.analyticService.getAllAnalytics(userId);
    }

    @Get('best-posts')
    async getBestPosts() {
        const userId = this.globalStateService.getUserId();
        if (!userId) {
            throw new Error('User ID is not defined.');
        }
        return await this.analyticService.getBestPosts(userId);
    }
}
