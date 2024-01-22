import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { User, UserSchema } from './user.schema';
import { UsersService } from './users.service';
import { JwtService } from '@nestjs/jwt';
import { BankService } from '../bank/bank.service';
import { Bank } from '../bank/bank.schema';
import { Bill } from '../bills/bill.schema';
import { Product } from '../products/product.schema';

describe('UserController', () => {
	let controller: UsersController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [UsersController],
			providers: [
				UsersService,
				JwtService,
				BankService,
				{
					provide: 'UserModel',
					useFactory: () => {
						return User;
					},
				},
				{
					provide: 'BankModel',
					useFactory: () => {
						return Bank;
					},
				},
				{
					provide: 'BillModel',
					useFactory: () => {
						return Bill;
					},
				},
				{
					provide: 'ProductModel',
					useFactory: () => {
						return Product;
					},
				},
			],
		}).compile();

		controller = module.get<UsersController>(UsersController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
