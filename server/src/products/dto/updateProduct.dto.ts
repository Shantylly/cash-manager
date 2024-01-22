import { ApiProperty } from '@nestjs/swagger';

export class UpdateProductDto {
	@ApiProperty()
	name?: string;

	@ApiProperty()
	description?: string;

	@ApiProperty()
	photo?: string;

	@ApiProperty()
	price?: number;
}
