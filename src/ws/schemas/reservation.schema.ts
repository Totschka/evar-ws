import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { GeoJsonObject } from 'geojson';
import { Document } from 'mongoose';
import { configs } from '../../configs';
import { constants } from '../../constants';

export type ReservationDocument = Reservation & Document;

@Schema({ versionKey: false })
export class Reservation {
  @Prop({
    default: function (this: ReservationDocument) {
      return `${new Date().toISOString()}_${this.user_id}`;
    },
  })
  reservation_id: string;

  @Prop({ required: true })
  user_id: string;

  @Prop({
    required: true,
    max: configs.maxChargeAmount,
    min: configs.minChargeAmount,
  })
  charge_amount: number;

  @Prop({
    validate: {
      validator: (v) => {
        return v >= new Date();
      },
      message: "can't reserve past time",
    },
  })
  reservation_date: Date;

  @Prop({ type: Object })
  location: GeoJsonObject;

  @Prop({ default: constants.RESERVATION_STATUS.READY })
  reservation_status: number;
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);
