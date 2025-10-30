import { Module } from '@nestjs/common';
import { DataAcquisitionController } from './data-acquisition.controller';
import { DataAcquisitionService } from './data-acquisition.service';
import { DataAcquisitionGateway } from './data-acquisition.gateway';
import { PrismaModule } from '../../prisma/prisma.module';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    PrismaModule,
    BullModule.registerQueue({
      name: 'data-acquisition',
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
  ],
  controllers: [DataAcquisitionController],
  providers: [DataAcquisitionService, DataAcquisitionGateway],
  exports: [DataAcquisitionService],
})
export class DataAcquisitionModule {}