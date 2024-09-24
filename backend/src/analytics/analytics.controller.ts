import { Controller, Get } from "@nestjs/common";
import { AnalyticService } from "./analytics.service";

@Controller('analytics')
export class AnalyticsController {
    constructor(private readonly analyticService: AnalyticService) { }

    @Get()
    async getAllAnalytics() {
        console.log('vann')
        const data = await this.analyticService.getAllAnalytics();
        console.log("Analytics Data:", data);
        return data;
    }
}
