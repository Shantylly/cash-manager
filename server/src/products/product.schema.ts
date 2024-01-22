import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Product extends Document {
	@Prop()
	name: string;

	@Prop()
	description: string;

	@Prop()
	photo: string;

	@Prop()
	price: number;

	@Prop({ type: Types.ObjectId, ref: 'User' })
	seller_id: Types.ObjectId;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
