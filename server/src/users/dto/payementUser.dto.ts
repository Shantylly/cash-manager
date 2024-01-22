import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class PaymentUserDto {
	@ApiProperty()
	billId: Types.ObjectId;

	@ApiProperty()
	type: 'NFC' | 'QR' | 'none';
}
