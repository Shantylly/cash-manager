import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Bill extends Document {
	@Prop({ type: Types.ObjectId, ref: 'User' })
	user_id: Types.ObjectId;

	@Prop()
	timestamp: string;

	@Prop({ default: 'none', enum: ['NFC', 'QR', 'none'] })
	type: string;

	@Prop()
	amount: number;

	@Prop({ default: 'Pending', enum: ['Pending', 'Paid', 'Deposit'] })
	status: 'Pending' | 'Paid' | 'Deposit';

	@Prop([{ type: Types.ObjectId, ref: 'Product' }])
	products: Types.ObjectId[];
}

export const BillSchema = SchemaFactory.createForClass(Bill);
