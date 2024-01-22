import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Bill, BillSchema } from './bill.schema';
import { BillsController } from './bills.controller';
import { BillsService } from './bills.service';
import { Product, ProductSchema } from 'src/products/product.schema';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Bill.name, schema: BillSchema }]),
		MongooseModule.forFeature([
			{ name: Product.name, schema: ProductSchema },
		]),
	],
	controllers: [BillsController],
	providers: [BillsService],
})
export class BillsModule {}
