import { ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'mongodb';

export class UpdateBillDto {
	@ApiProperty()
	type?: string;

	@ApiProperty()
	products?: ObjectId[];
}
