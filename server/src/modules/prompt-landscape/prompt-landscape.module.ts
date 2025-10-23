import { Module } from '@nestjs/common';
import { PromptLandscapeController } from './prompt-landscape.controller';
import { PromptLandscapeService } from './prompt-landscape.service';
import { Neo4jModule } from '../neo4j/neo4j.module';

@Module({
  imports: [Neo4jModule],
  controllers: [PromptLandscapeController],
  providers: [PromptLandscapeService],
  exports: [PromptLandscapeService],
})
export class PromptLandscapeModule {}
