import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { RoadmapService } from './roadmap.service';
import { CreateRoadmapDto } from './dto/create-roadmap.dto';
import { UpdateRoadmapDto } from './dto/update-roadmap.dto';
import { QueryRoadmapDto } from './dto/query-roadmap.dto';

@ApiTags('roadmap')
@Controller('roadmap')
export class RoadmapController {
  constructor(private readonly roadmapService: RoadmapService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new roadmap item' })
  @ApiResponse({ status: 201, description: 'Roadmap item created successfully' })
  create(@Body() createRoadmapDto: CreateRoadmapDto) {
    return this.roadmapService.create(createRoadmapDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all roadmap items with filters' })
  @ApiResponse({ status: 200, description: 'Return paginated roadmap items' })
  @ApiQuery({ type: QueryRoadmapDto })
  findAll(@Query() query: QueryRoadmapDto) {
    return this.roadmapService.findAll(query);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get roadmap statistics' })
  @ApiResponse({ status: 200, description: 'Return roadmap statistics' })
  getStats() {
    return this.roadmapService.getStats();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a roadmap item by ID' })
  @ApiResponse({ status: 200, description: 'Return roadmap item' })
  @ApiResponse({ status: 404, description: 'Roadmap item not found' })
  findOne(@Param('id') id: string) {
    return this.roadmapService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a roadmap item' })
  @ApiResponse({ status: 200, description: 'Roadmap item updated successfully' })
  @ApiResponse({ status: 404, description: 'Roadmap item not found' })
  update(@Param('id') id: string, @Body() updateRoadmapDto: UpdateRoadmapDto) {
    return this.roadmapService.update(id, updateRoadmapDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a roadmap item' })
  @ApiResponse({ status: 200, description: 'Roadmap item deleted successfully' })
  @ApiResponse({ status: 404, description: 'Roadmap item not found' })
  remove(@Param('id') id: string) {
    return this.roadmapService.remove(id);
  }
}
