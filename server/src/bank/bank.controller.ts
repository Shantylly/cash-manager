import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { BankService } from './bank.service';

import { AuthGuard } from '../auth/auth.guard';
import { ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../decorator/role.decorator';
import { Role } from '../model/enum/role.enum';
import { addMoneyDto } from './dto/addMoney.dto';

@ApiTags('Bank')
@Controller('bank')
export class BankController {
	constructor(private readonly BankService: BankService) {}

	// Get bank total amount
	@Get()
	@ApiHeader({
		name: 'Authorization',
		description: 'Bearer {token}',
	})
	@ApiResponse({ status: 200, description: 'Get bank amount successful' })
	@ApiResponse({ status: 401, description: 'Unauthorized' })
	@ApiResponse({ status: 500, description: 'Internal server error' })
	@Roles(Role.Admin)
	@UseGuards(AuthGuard)
	async findAll() {
		return this.BankService.getBankAmount();
	}

	@Post('add/:id')
	@ApiHeader({
		name: 'Authorization',
		description: 'Bearer {token}',
	})
	@ApiResponse({ status: 200, description: 'Add money successful' })
	@ApiResponse({ status: 401, description: 'Unauthorized' })
	@ApiResponse({ status: 500, description: 'Internal server error' })
	@Roles(Role.Admin)
	@UseGuards(AuthGuard)
	async addMoney(
		@Param('id') bankId: string,
		@Body() addMoneyDto: addMoneyDto,
	) {
		return this.BankService.addMoney(
			addMoneyDto.user_id,
			addMoneyDto.amount,
		);
	}
}
