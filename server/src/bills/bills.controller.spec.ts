import { Test, TestingModule } from '@nestjs/testing';
import { BillsController } from './bills.controller';
import { BillsService } from './bills.service';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth/auth.service';
import { AuthGuard } from '../auth/auth.guard';
import { Bill } from './bill.schema';
import { Product } from '../products/product.schema';

describe('BillController', () => {
	let controller: BillsController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [BillsController],
			providers: [
				BillsService,
				JwtService,
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

		controller = module.get<BillsController>(BillsController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
