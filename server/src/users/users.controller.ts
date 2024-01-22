import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	Get,
	InternalServerErrorException,
	Patch,
	Post,
	Req,
	UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { AuthGuard } from '../auth/auth.guard';
import { UpdateUserDto } from './dto/updateUser.dto';
import { ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaymentUserDto } from './dto/payementUser.dto';
import { BankService } from '../bank/bank.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
	constructor(
		private readonly usersService: UsersService,
		private readonly jwtService: JwtService,
		private readonly bankService: BankService,
	) {}

	// @Get()
	// @Roles(Role.Admin)
	// async findAll() {
	//     return this.usersService.findAll();
	// }

	@Get('profile')
	@ApiHeader({
		name: 'Authorization',
		description: 'Bearer {token}',
	})
	@ApiResponse({ status: 200, description: 'Get profile successful' })
	@ApiResponse({ status: 401, description: 'Unauthorized' })
	@ApiResponse({ status: 500, description: 'Internal server error' })
	@UseGuards(AuthGuard)
	async getProfile(
		@Req() request: { headers: { authorization: string } } & Request,
	) {
		const token = request.headers.authorization.split(' ')[1];
		const decode = this.jwtService.decode(token);
		const userProfile = await this.usersService.findOneById(decode['sub'], {
			password: 0,
		});
		if (!userProfile) {
			return InternalServerErrorException;
		}
		return userProfile;
	}

	@Patch('update')
	@ApiHeader({
		name: 'Authorization',
		description: 'Bearer {token}',
	})
	@ApiResponse({ status: 200, description: 'Update profile successful' })
	@ApiResponse({ status: 401, description: 'Unauthorized' })
	@ApiResponse({ status: 400, description: 'Bad Request' })
	@UseGuards(AuthGuard)
	async update(
		@Req() request: { headers: { authorization: string } } & Request,
		@Body() updateUserDto: UpdateUserDto,
	) {
		const token = request.headers.authorization.split(' ')[1];
		const decode = this.jwtService.decode(token);

		for (const key of Object.keys(updateUserDto)) {
			if (key === 'balance')
				throw new BadRequestException('Cannot update balance');
			else if (key === 'roles')
				throw new BadRequestException('Cannot update roles');
			else if (key === 'password')
				updateUserDto.password = await bcrypt.hash(
					updateUserDto.password as string,
					Number(process.env.BCRYPT_SALT),
				);
		}

		return this.usersService.update(decode['sub'], updateUserDto);
	}

	@Delete('delete')
	@ApiHeader({
		name: 'Authorization',
		description: 'Bearer {token}',
	})
	@ApiResponse({ status: 200, description: 'Delete profile successful' })
	@ApiResponse({ status: 401, description: 'Unauthorized' })
	@UseGuards(AuthGuard)
	async delete(
		@Req() request: { headers: { authorization: string } } & Request,
	) {
		const token = request.headers.authorization.split(' ')[1];
		const decode = this.jwtService.decode(token);
		return this.usersService.delete(decode['sub']);
	}

	@Post('payment')
	@ApiHeader({
		name: 'TODO',
		description: 'Test this',
	})
	@UseGuards(AuthGuard)
	async payment(
		@Body() payementDto: PaymentUserDto,
	): Promise<{ message: string }> {
		return this.bankService.handlePayment(
			payementDto.billId,
			payementDto.type,
		);
	}
}
