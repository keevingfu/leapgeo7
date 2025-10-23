import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CitationService } from './citation.service';
import { Prisma } from '../../../generated/prisma';

@ApiTags('citations')
@Controller('citations')
export class CitationController {
  constructor(private readonly citationService: CitationService) {}

  @Post()
  @ApiOperation({ summary: 'Create new citation' })
  @ApiResponse({ status: 201, description: 'Citation created successfully' })
  create(@Body() data: Prisma.CitationCreateInput) {
    return this.citationService.create(data);
  }

  @Get()
  @ApiOperation({ summary: 'Get all citations with filters' })
  @ApiResponse({ status: 200, description: 'Return paginated citation list' })
  findAll(@Query() filters: any) {
    return this.citationService.findAll(filters);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get citation statistics' })
  @ApiResponse({ status: 200, description: 'Return citation statistics' })
  getStats() {
    return this.citationService.getStats();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get citation by ID' })
  @ApiResponse({ status: 200, description: 'Return citation details' })
  @ApiResponse({ status: 404, description: 'Citation not found' })
  findOne(@Param('id') id: string) {
    return this.citationService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update citation' })
  @ApiResponse({ status: 200, description: 'Citation updated successfully' })
  @ApiResponse({ status: 404, description: 'Citation not found' })
  update(@Param('id') id: string, @Body() data: Prisma.CitationUpdateInput) {
    return this.citationService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete citation' })
  @ApiResponse({ status: 200, description: 'Citation deleted successfully' })
  @ApiResponse({ status: 404, description: 'Citation not found' })
  remove(@Param('id') id: string) {
    return this.citationService.remove(id);
  }
}
