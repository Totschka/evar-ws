import { InjectModel } from '@nestjs/mongoose';
import { MessageBody, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Model } from 'mongoose';
import { Server, Socket } from 'socket.io';
import { Reservation, ReservationDocument } from './schemas/reservation.schema';
import { Truck, TruckDocument } from './schemas/truck.schema';

@WebSocketGateway({ cors: { origin: '*' } })
export class WsGateway implements OnGatewayInit {
  constructor(
    @InjectModel(Reservation.name) private reservationModel: Model<ReservationDocument>,
    @InjectModel(Truck.name) private truckModel: Model<TruckDocument>,
  ) {}

  @WebSocketServer()
  server: Server;

  afterInit(server: any) {
    this.reservationModel.watch().on('change', (data) => {
      console.log('reservation status change', data);
      this.server.emit('updateReservationStatus', data);
    });

    this.truckModel.watch().on('change', (data) => {
      console.log('truck status change', data);
      this.server.emit('updateTruckStatus', data);
    });
  }

  @SubscribeMessage('echo')
  onMessage(client: Socket, @MessageBody() data: any) {
    this.server.emit('echo', { data });
  }
}
