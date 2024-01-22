import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { Role } from '../model/enum/role.enum';

@Schema()
export class User extends Document {
	@Prop({ required: true, unique: true })
	username: string;

	@Prop({ required: true, unique: true })
	email: string;

	@Prop({ required: true })
	password: string;

	@Prop({ required: true })
	firstName: string;

	@Prop({ required: true })
	lastName: string;

	@Prop({ default: 1000 })
	balance: number;

	@Prop({ default: Role.User })
	roles: Role;
}

export const UserSchema = SchemaFactory.createForClass(User);
