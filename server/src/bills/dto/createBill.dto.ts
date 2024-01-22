import { ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'mongodb';

export class CreateBillDto {
	@ApiProperty()
	user_id: ObjectId;

	@ApiProperty()
	type: string;

	@ApiProperty()
	products: ObjectId[];
}
