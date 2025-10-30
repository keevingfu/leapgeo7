import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { Neo4jModule } from './modules/neo4j/neo4j.module';
import { Neo4jGdsModule } from './modules/neo4j-gds/neo4j-gds.module';
import { RoadmapModule } from './modules/roadmap/roadmap.module';
import { ContentModule } from './modules/content/content.module';
import { CitationModule } from './modules/citation/citation.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { PromptLandscapeModule } from './modules/prompt-landscape/prompt-landscape.module';
import { DataAcquisitionModule } from './modules/data-acquisition/data-acquisition.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    Neo4jModule,
    Neo4jGdsModule,
    RoadmapModule,
    ContentModule,
    CitationModule,
    AnalyticsModule,
    PromptLandscapeModule,
    DataAcquisitionModule, // NEW: Data Acquisition Module for MCP integration
  ],
})
export class AppModule {}
