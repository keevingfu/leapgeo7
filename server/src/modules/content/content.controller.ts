import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ContentService } from './content.service';
import { Prisma } from '../../../generated/prisma';

@ApiTags('content')
@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Post()
  @ApiOperation({ summary: 'Create new content' })
  @ApiResponse({ status: 201, description: 'Content created successfully' })
  create(@Body() data: Prisma.ContentCreateInput) {
    return this.contentService.create(data);
  }

  @Get()
  @ApiOperation({ summary: 'Get all content with filters' })
  @ApiResponse({ status: 200, description: 'Return paginated content list' })
  findAll(@Query() filters: any) {
    return this.contentService.findAll(filters);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get content statistics' })
  @ApiResponse({ status: 200, description: 'Return content statistics' })
  getStats() {
    return this.contentService.getStats();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get content by ID' })
  @ApiResponse({ status: 200, description: 'Return content details' })
  @ApiResponse({ status: 404, description: 'Content not found' })
  findOne(@Param('id') id: string) {
    return this.contentService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update content' })
  @ApiResponse({ status: 200, description: 'Content updated successfully' })
  @ApiResponse({ status: 404, description: 'Content not found' })
  update(@Param('id') id: string, @Body() data: Prisma.ContentUpdateInput) {
    return this.contentService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete content' })
  @ApiResponse({ status: 200, description: 'Content deleted successfully' })
  @ApiResponse({ status: 404, description: 'Content not found' })
  remove(@Param('id') id: string) {
    return this.contentService.remove(id);
  }
}
