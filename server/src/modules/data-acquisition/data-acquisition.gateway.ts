import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { ScrapingProgressDto, DataSourceResponseDto } from './dto/data-acquisition.dto';

@WebSocketGateway({
  namespace: '/scraping-progress',
  cors: {
    origin: 'http://localhost:5173', // Frontend URL
    credentials: true,
  },
})
export class DataAcquisitionGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(DataAcquisitionGateway.name);

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway initialized');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);

    // Send initial connection confirmation
    client.emit('connected', {
      message: 'Connected to scraping progress WebSocket',
      clientId: client.id,
    });
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  /**
   * Emit scraping progress to all connected clients
   */
  emitScrapingProgress(progress: ScrapingProgressDto) {
    this.server.emit('scraping-progress', progress);
    this.logger.log(`Emitting progress for source ${progress.sourceId}: ${progress.progress}%`);
  }

  /**
   * Emit when a new data source is created
   */
  emitDataSourceCreated(dataSource: DataSourceResponseDto) {
    this.server.emit('data-source-created', dataSource);
    this.logger.log(`New data source created: ${dataSource.id}`);
  }

  /**
   * Emit when a data source is updated
   */
  emitDataSourceUpdated(dataSource: DataSourceResponseDto) {
    this.server.emit('data-source-updated', dataSource);
    this.logger.log(`Data source updated: ${dataSource.id}`);
  }

  /**
   * Emit when a data source is deleted
   */
  emitDataSourceDeleted(sourceId: string) {
    this.server.emit('data-source-deleted', { sourceId });
    this.logger.log(`Data source deleted: ${sourceId}`);
  }

  /**
   * Subscribe to specific data source updates
   */
  @SubscribeMessage('subscribe-to-source')
  handleSubscribeToSource(client: Socket, sourceId: string) {
    client.join(`source-${sourceId}`);
    this.logger.log(`Client ${client.id} subscribed to source ${sourceId}`);
    return {
      event: 'subscribed',
      data: { sourceId },
    };
  }

  /**
   * Unsubscribe from specific data source updates
   */
  @SubscribeMessage('unsubscribe-from-source')
  handleUnsubscribeFromSource(client: Socket, sourceId: string) {
    client.leave(`source-${sourceId}`);
    this.logger.log(`Client ${client.id} unsubscribed from source ${sourceId}`);
    return {
      event: 'unsubscribed',
      data: { sourceId },
    };
  }

  /**
   * Request current status of all data sources
   */
  @SubscribeMessage('request-all-status')
  async handleRequestAllStatus(client: Socket) {
    this.logger.log(`Client ${client.id} requested all source statuses`);

    // In production, this would fetch actual statuses from the service
    const mockStatuses = [
      { sourceId: 'src-001', status: 'idle', progress: 0 },
      { sourceId: 'src-002', status: 'running', progress: 45 },
      { sourceId: 'src-003', status: 'completed', progress: 100 },
    ];

    client.emit('all-source-status', mockStatuses);
    return {
      event: 'status-sent',
      data: { count: mockStatuses.length },
    };
  }
}