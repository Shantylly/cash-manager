import { ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'mongodb';

export class addMoneyDto {
	@ApiProperty()
	user_id: ObjectId;

	@ApiProperty()
	amount: number;
}
