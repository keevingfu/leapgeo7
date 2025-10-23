import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';

@ApiTags('analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get dashboard overview metrics' })
  @ApiResponse({ status: 200, description: 'Return dashboard metrics' })
  getDashboard() {
    return this.analyticsService.getDashboard();
  }

  @Get('kpi-trends')
  @ApiOperation({ summary: 'Get KPI trends over time' })
  @ApiResponse({ status: 200, description: 'Return KPI trend data' })
  @ApiQuery({ name: 'startDate', required: true, type: String })
  @ApiQuery({ name: 'endDate', required: true, type: String })
  getKpiTrends(@Query('startDate') startDate: string, @Query('endDate') endDate: string) {
    return this.analyticsService.getKpiTrends(new Date(startDate), new Date(endDate));
  }

  @Get('citation-trends')
  @ApiOperation({ summary: 'Get citation trends over time' })
  @ApiResponse({ status: 200, description: 'Return citation trend data' })
  @ApiQuery({ name: 'startDate', required: true, type: String })
  @ApiQuery({ name: 'endDate', required: true, type: String })
  getCitationTrends(@Query('startDate') startDate: string, @Query('endDate') endDate: string) {
    return this.analyticsService.getCitationTrends(new Date(startDate), new Date(endDate));
  }

  @Get('content-coverage')
  @ApiOperation({ summary: 'Get content coverage analysis' })
  @ApiResponse({ status: 200, description: 'Return content coverage statistics' })
  getContentCoverage() {
    return this.analyticsService.getContentCoverage();
  }

  @Get('performance-report')
  @ApiOperation({ summary: 'Get performance report' })
  @ApiResponse({ status: 200, description: 'Return top performing content' })
  getPerformanceReport() {
    return this.analyticsService.getPerformanceReport();
  }
}
