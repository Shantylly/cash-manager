import { ObjectId } from 'mongodb';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
	@ApiProperty()
	name: string;

	@ApiProperty()
	description: string;

	@ApiProperty()
	photo: string;

	@ApiProperty()
	price: number;

	@ApiProperty()
	seller_id: ObjectId;
}
