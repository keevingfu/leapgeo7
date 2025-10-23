import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '../../../generated/prisma';

@Injectable()
export class ContentService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.ContentCreateInput) {
    return this.prisma.content.create({
      data,
      include: {
        roadmap: true,
        citations: true,
      },
    });
  }

  async findAll(filters?: { channel?: string; publishStatus?: string; page?: number; limit?: number }) {
    const { page = 1, limit = 20, ...where } = filters || {};
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.prisma.content.findMany({
        where: where as any,
        orderBy: { publishDate: 'desc' },
        skip,
        take: limit,
        include: {
          roadmap: {
            select: { prompt: true, pLevel: true },
          },
          _count: {
            select: { citations: true },
          },
        },
      }),
      this.prisma.content.count({ where: where as any }),
    ]);

    return {
      items,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string) {
    const content = await this.prisma.content.findUnique({
      where: { id },
      include: {
        roadmap: true,
        citations: { orderBy: { detectedAt: 'desc' } },
      },
    });

    if (!content) {
      throw new NotFoundException(`Content with ID ${id} not found`);
    }

    return content;
  }

  async update(id: string, data: Prisma.ContentUpdateInput) {
    const content = await this.prisma.content.findUnique({ where: { id } });
    if (!content) {
      throw new NotFoundException(`Content with ID ${id} not found`);
    }

    return this.prisma.content.update({
      where: { id },
      data,
      include: { roadmap: true, citations: true },
    });
  }

  async remove(id: string) {
    const content = await this.prisma.content.findUnique({ where: { id } });
    if (!content) {
      throw new NotFoundException(`Content with ID ${id} not found`);
    }

    return this.prisma.content.delete({ where: { id } });
  }

  async getStats() {
    const [total, byChannel, byStatus] = await Promise.all([
      this.prisma.content.count(),
      this.prisma.content.groupBy({
        by: ['channel'],
        _count: true,
      }),
      this.prisma.content.groupBy({
        by: ['publishStatus'],
        _count: true,
      }),
    ]);

    const avgMetrics = await this.prisma.content.aggregate({
      _avg: {
        kpiCtr: true,
        kpiViews: true,
        kpiGmv: true,
        kpiEngagement: true,
        kpiConversion: true,
      },
    });

    return { total, byChannel, byStatus, averages: avgMetrics._avg };
  }
}
