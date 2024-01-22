import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Bank extends Document {
	@Prop({ default: 'EpiBank', unique: true })
	name: string;

	@Prop({ default: 1000000 })
	amount: number;
}

export const BankSchema = SchemaFactory.createForClass(Bank);
