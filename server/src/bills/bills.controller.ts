import {
	BadRequestException,
	Body,
	Controller,
	Get,
	NotFoundException,
	Param,
	Patch,
	Post,
	Req,
	UnauthorizedException,
	UseGuards,
} from '@nestjs/common';
import { ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';
import { BillsService } from './bills.service';
import { AuthGuard } from '../auth/auth.guard';
import { CreateBillDto } from './dto/createBill.dto';
import { UpdateBillDto } from './dto/updateBill.dto';
import { Types } from 'mongoose';

@ApiTags('Bills')
@Controller('bills')
export class BillsController {
	constructor(
		private readonly billsService: BillsService,
		private readonly jwtService: JwtService,
	) {}

	// Get bills controller
	@ApiResponse({ status: 200, description: 'Get bills successful' })
	@ApiResponse({ status: 401, description: 'Unauthorized' })
	@ApiResponse({ status: 500, description: 'Internal server error' })
	@Get()
	async findAll() {
		return this.billsService.findAll();
	}

	// Get bill controller
	@ApiResponse({ status: 200, description: 'Get bill successful' })
	@ApiResponse({ status: 401, description: 'Unauthorized' })
	@ApiResponse({ status: 500, description: 'Internal server error' })
	@Get(':id')
	async findOne(@Param('id') billId: string) {
		return this.billsService.findOne(billId);
	}

	// Get all bills for a user controller
	@ApiResponse({
		status: 200,
		description: 'Get all bills for a user successful',
	})
	@ApiResponse({ status: 401, description: 'Unauthorized' })
	@UseGuards(AuthGuard)
	@Get('user/:userId')
	async findAllByUser(@Param('userId') userId: string) {
		return this.billsService.findAllByUser(userId);
	}

	// Create bill controller
	@ApiHeader({
		name: 'Authorization',
		description: 'Bearer {token}',
	})
	@ApiResponse({ status: 200, description: 'Create bill successful' })
	@ApiResponse({ status: 401, description: 'Unauthorized' })
	@ApiResponse({ status: 404, description: 'Error: user_id not found' })
	@UseGuards(AuthGuard)
	@Post('create')
	async create(@Body() createBillDto: CreateBillDto) {
		if (Types.ObjectId.isValid(createBillDto.user_id)) {
			const createdBill = await this.billsService.create(createBillDto);
			return { message: 'Bill created successfully', bill: createdBill };
		} else {
			throw new NotFoundException('User not found');
		}
	}

	// Update bill controller
	@ApiHeader({
		name: 'Authorization',
		description: 'Bearer {token}',
	})
	@ApiResponse({ status: 200, description: 'Update bill successful' })
	@ApiResponse({ status: 400, description: 'User id is not buyer id' })
	@ApiResponse({ status: 400, description: 'Cannot modify user_id' })
	@ApiResponse({ status: 401, description: 'Unauthorized' })
	@ApiResponse({ status: 404, description: 'Error: bill_id not found' })
	@UseGuards(AuthGuard)
	@Patch(':id')
	async update(
		@Param('id') billId: string,
		@Body() updateBillDto: UpdateBillDto,
		@Req() request: { headers: { authorization?: string } } & Request,
	) {
		const existingBill = await this.billsService.findOne(billId);

		if (!existingBill) {
			throw new NotFoundException('Bill not found');
		}

		const authorizationHeader = request.headers.authorization;

		if (!authorizationHeader) {
			throw new UnauthorizedException('Authorization header is missing');
		}

		const token = authorizationHeader.split(' ')[1];

		if (!token) {
			throw new UnauthorizedException('Token is missing');
		}

		const decode = this.jwtService.decode(token);

		if (!decode || !decode['sub']) {
			throw new UnauthorizedException('Invalid token');
		}

		const user_id = decode['sub'];

		if (existingBill.user_id.toString() !== user_id) {
			throw new BadRequestException(
				'You are not authorized to update this bill',
			);
		}

		for (const key of Object.keys(updateBillDto)) {
			if (key === 'user_id') {
				throw new BadRequestException('Cannot modify user_id');
			}
		}

		const updatedBill = await this.billsService.update(
			billId,
			updateBillDto,
		);

		if (updatedBill) {
			return { message: 'Bill updated successfully', bill: updatedBill };
		} else {
			throw new NotFoundException('Bill not found');
		}
	}
}
