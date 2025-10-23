import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateRoadmapDto } from './dto/create-roadmap.dto';
import { UpdateRoadmapDto } from './dto/update-roadmap.dto';
import { QueryRoadmapDto } from './dto/query-roadmap.dto';
import { Prisma } from '../../../generated/prisma';

@Injectable()
export class RoadmapService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a new roadmap item
   */
  async create(createRoadmapDto: CreateRoadmapDto) {
    return this.prisma.roadmap.create({
      data: createRoadmapDto,
      include: {
        citations: true,
        contents: true,
      },
    });
  }

  /**
   * Find all roadmap items with filters and pagination
   */
  async findAll(query: QueryRoadmapDto) {
    const { page = 1, limit = 20, sortBy = 'enhancedGeoScore', sortOrder = 'desc', ...filters } = query;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.RoadmapWhereInput = {};

    if (filters.month) {
      where.month = filters.month;
    }

    if (filters.pLevel) {
      where.pLevel = filters.pLevel;
    }

    if (filters.search) {
      where.prompt = {
        contains: filters.search,
        mode: 'insensitive',
      };
    }

    // Build orderBy clause
    const orderBy: Prisma.RoadmapOrderByWithRelationInput = {};
    orderBy[sortBy] = sortOrder;

    // Execute query with pagination
    const [items, total] = await Promise.all([
      this.prisma.roadmap.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          _count: {
            select: {
              citations: true,
              contents: true,
            },
          },
        },
      }),
      this.prisma.roadmap.count({ where }),
    ]);

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Find one roadmap item by ID
   */
  async findOne(id: string) {
    const roadmap = await this.prisma.roadmap.findUnique({
      where: { id },
      include: {
        citations: {
          orderBy: { detectedAt: 'desc' },
          take: 10,
        },
        contents: {
          orderBy: { publishDate: 'desc' },
          take: 10,
        },
        _count: {
          select: {
            citations: true,
            contents: true,
          },
        },
      },
    });

    if (!roadmap) {
      throw new NotFoundException(`Roadmap item with ID ${id} not found`);
    }

    return roadmap;
  }

  /**
   * Update a roadmap item
   */
  async update(id: string, updateRoadmapDto: UpdateRoadmapDto) {
    const roadmap = await this.prisma.roadmap.findUnique({ where: { id } });

    if (!roadmap) {
      throw new NotFoundException(`Roadmap item with ID ${id} not found`);
    }

    return this.prisma.roadmap.update({
      where: { id },
      data: updateRoadmapDto,
      include: {
        citations: true,
        contents: true,
      },
    });
  }

  /**
   * Delete a roadmap item
   */
  async remove(id: string) {
    const roadmap = await this.prisma.roadmap.findUnique({ where: { id } });

    if (!roadmap) {
      throw new NotFoundException(`Roadmap item with ID ${id} not found`);
    }

    return this.prisma.roadmap.delete({
      where: { id },
    });
  }

  /**
   * Get roadmap statistics
   */
  async getStats() {
    const [total, byPLevel, byMonth] = await Promise.all([
      this.prisma.roadmap.count(),
      this.prisma.roadmap.groupBy({
        by: ['pLevel'],
        _count: true,
      }),
      this.prisma.roadmap.groupBy({
        by: ['month'],
        _count: true,
        orderBy: {
          month: 'desc',
        },
        take: 6,
      }),
    ]);

    const avgGeoScore = await this.prisma.roadmap.aggregate({
      _avg: {
        enhancedGeoScore: true,
        quickWinIndex: true,
      },
    });

    return {
      total,
      byPLevel,
      byMonth,
      averages: {
        geoScore: avgGeoScore._avg.enhancedGeoScore || 0,
        quickWinIndex: avgGeoScore._avg.quickWinIndex || 0,
      },
    };
  }

  /**
   * Calculate priority score for a roadmap item
   */
  calculatePriorityScore(geoScore: number, quickWinIndex: number): number {
    return geoScore * 0.7 + quickWinIndex * 0.3;
  }

  /**
   * Auto-assign P-Level based on total score
   */
  autoAssignPLevel(totalScore: number): string {
    if (totalScore >= 100) return 'P0';
    if (totalScore >= 75) return 'P1';
    if (totalScore >= 50) return 'P2';
    return 'P3';
  }
}
