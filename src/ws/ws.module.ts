import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Reservation, ReservationSchema } from './schemas/reservation.schema';
import { Truck, TruckSchema } from './schemas/truck.schema';
import { WsGateway } from './ws.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Truck.name, schema: TruckSchema },
      { name: Reservation.name, schema: ReservationSchema },
    ]),
  ],
  providers: [WsGateway],
})
export class WsModule {}
