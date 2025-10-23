import { Module } from '@nestjs/common';
import { CitationService } from './citation.service';
import { CitationController } from './citation.controller';

@Module({
  controllers: [CitationController],
  providers: [CitationService],
  exports: [CitationService],
})
export class CitationModule {}
