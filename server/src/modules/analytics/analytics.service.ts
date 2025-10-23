import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get dashboard overview metrics
   */
  async getDashboard() {
    const [roadmapStats, contentStats, citationStats] = await Promise.all([
      this.getRoadmapMetrics(),
      this.getContentMetrics(),
      this.getCitationMetrics(),
    ]);

    return {
      roadmap: roadmapStats,
      content: contentStats,
      citations: citationStats,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Get roadmap metrics
   */
  private async getRoadmapMetrics() {
    const [total, byPLevel] = await Promise.all([
      this.prisma.roadmap.count(),
      this.prisma.roadmap.groupBy({
        by: ['pLevel'],
        _count: true,
        _avg: {
          enhancedGeoScore: true,
          quickWinIndex: true,
        },
      }),
    ]);

    return { total, byPLevel };
  }

  /**
   * Get content metrics
   */
  private async getContentMetrics() {
    const [total, byChannel, byStatus] = await Promise.all([
      this.prisma.content.count(),
      this.prisma.content.groupBy({
        by: ['channel'],
        _count: true,
        _avg: {
          kpiCtr: true,
          kpiViews: true,
        },
      }),
      this.prisma.content.groupBy({
        by: ['publishStatus'],
        _count: true,
      }),
    ]);

    const published = byStatus.find((s: any) => s.publishStatus === 'PUBLISHED')?._count || 0;

    return { total, published, byChannel, byStatus };
  }

  /**
   * Get citation metrics
   */
  private async getCitationMetrics() {
    const [total, byPlatform, byStrength, aiIndexed, active] = await Promise.all([
      this.prisma.citation.count(),
      this.prisma.citation.groupBy({
        by: ['platform'],
        _count: true,
      }),
      this.prisma.citation.groupBy({
        by: ['citationStrength'],
        _count: true,
      }),
      this.prisma.citation.count({ where: { aiIndexed: true } }),
      this.prisma.citation.count({ where: { isActive: true } }),
    ]);

    return {
      total,
      active,
      aiIndexed,
      byPlatform,
      byStrength,
      indexRate: total > 0 ? ((aiIndexed / total) * 100).toFixed(2) : 0,
    };
  }

  /**
   * Get KPI trends over time
   */
  async getKpiTrends(startDate: Date, endDate: Date) {
    const contents = await this.prisma.content.findMany({
      where: {
        publishDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        publishDate: true,
        kpiCtr: true,
        kpiViews: true,
        kpiGmv: true,
        kpiEngagement: true,
      },
      orderBy: {
        publishDate: 'asc',
      },
    });

    return contents;
  }

  /**
   * Get citation trends over time
   */
  async getCitationTrends(startDate: Date, endDate: Date) {
    const citations = await this.prisma.citation.findMany({
      where: {
        detectedAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        detectedAt: true,
        platform: true,
        citationStrength: true,
        aiIndexed: true,
      },
      orderBy: {
        detectedAt: 'asc',
      },
    });

    return citations;
  }

  /**
   * Get content coverage analysis
   */
  async getContentCoverage() {
    // Find roadmap items with and without content
    const roadmapItems = await this.prisma.roadmap.findMany({
      select: {
        id: true,
        prompt: true,
        pLevel: true,
        _count: {
          select: {
            contents: true,
          },
        },
      },
      orderBy: {
        pLevel: 'asc',
      },
    });

    const covered = roadmapItems.filter((item: any) => item._count.contents > 0);
    const uncovered = roadmapItems.filter((item: any) => item._count.contents === 0);

    return {
      total: roadmapItems.length,
      covered: covered.length,
      uncovered: uncovered.length,
      coverageRate: roadmapItems.length > 0
        ? ((covered.length / roadmapItems.length) * 100).toFixed(2)
        : 0,
      uncoveredItems: uncovered.slice(0, 20), // Top 20 uncovered prompts
    };
  }

  /**
   * Get performance report
   */
  async getPerformanceReport() {
    const topPerformingContent = await this.prisma.content.findMany({
      orderBy: {
        kpiViews: 'desc',
      },
      take: 10,
      include: {
        roadmap: {
          select: { prompt: true, pLevel: true },
        },
        _count: {
          select: { citations: true },
        },
      },
    });

    const topCitedContent = await this.prisma.content.findMany({
      orderBy: {
        citations: {
          _count: 'desc',
        },
      },
      take: 10,
      include: {
        roadmap: {
          select: { prompt: true, pLevel: true },
        },
        _count: {
          select: { citations: true },
        },
      },
    });

    return {
      topPerforming: topPerformingContent,
      topCited: topCitedContent,
    };
  }
}
