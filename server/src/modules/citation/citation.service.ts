import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '../../../generated/prisma';

@Injectable()
export class CitationService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.CitationCreateInput) {
    return this.prisma.citation.create({
      data,
      include: {
        roadmap: true,
        content: true,
      },
    });
  }

  async findAll(filters?: { platform?: string; citationStrength?: string; aiIndexed?: boolean; page?: number; limit?: number }) {
    const { page = 1, limit = 20, ...where } = filters || {};
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.prisma.citation.findMany({
        where: where as any,
        orderBy: { detectedAt: 'desc' },
        skip,
        take: limit,
        include: {
          roadmap: {
            select: { prompt: true, pLevel: true },
          },
          content: {
            select: { title: true, channel: true },
          },
        },
      }),
      this.prisma.citation.count({ where: where as any }),
    ]);

    return {
      items,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string) {
    const citation = await this.prisma.citation.findUnique({
      where: { id },
      include: {
        roadmap: true,
        content: true,
      },
    });

    if (!citation) {
      throw new NotFoundException(`Citation with ID ${id} not found`);
    }

    return citation;
  }

  async update(id: string, data: Prisma.CitationUpdateInput) {
    const citation = await this.prisma.citation.findUnique({ where: { id } });
    if (!citation) {
      throw new NotFoundException(`Citation with ID ${id} not found`);
    }

    return this.prisma.citation.update({
      where: { id },
      data,
      include: { roadmap: true, content: true },
    });
  }

  async remove(id: string) {
    const citation = await this.prisma.citation.findUnique({ where: { id } });
    if (!citation) {
      throw new NotFoundException(`Citation with ID ${id} not found`);
    }

    return this.prisma.citation.delete({ where: { id } });
  }

  async getStats() {
    const [total, byPlatform, byStrength, aiIndexedCount] = await Promise.all([
      this.prisma.citation.count(),
      this.prisma.citation.groupBy({
        by: ['platform'],
        _count: true,
      }),
      this.prisma.citation.groupBy({
        by: ['citationStrength'],
        _count: true,
      }),
      this.prisma.citation.count({
        where: { aiIndexed: true },
      }),
    ]);

    const activeCount = await this.prisma.citation.count({
      where: { isActive: true },
    });

    return {
      total,
      active: activeCount,
      aiIndexed: aiIndexedCount,
      byPlatform,
      byStrength,
      indexRate: total > 0 ? ((aiIndexedCount / total) * 100).toFixed(2) : 0,
    };
  }
}
