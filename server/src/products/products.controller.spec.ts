import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { JwtService } from '@nestjs/jwt';
import { ProductsService } from './products.service';
import { AuthGuard } from '../auth/auth.guard';
import { Product } from './product.schema';

describe('ProductController', () => {
	let controller: ProductsController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [ProductsController],
			providers: [
				ProductsService,
				JwtService,
				{
					provide: 'ProductModel',
					useFactory: () => {
						return Product;
					},
				},
			],
		}).compile();

		controller = module.get<ProductsController>(ProductsController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
