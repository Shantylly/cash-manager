import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Bank, BankSchema } from 'src/bank/bank.schema';
import { BankService } from 'src/bank/bank.service';
import { Bill, BillSchema } from 'src/bills/bill.schema';
import { Product, ProductSchema } from 'src/products/product.schema';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
		MongooseModule.forFeature([{ name: Bank.name, schema: BankSchema }]),
		MongooseModule.forFeature([{ name: Bill.name, schema: BillSchema }]),
		MongooseModule.forFeature([
			{ name: Product.name, schema: ProductSchema },
		]),
	],
	controllers: [UsersController],
	providers: [UsersService, BankService],
	exports: [UsersService],
})
export class UsersModule {}
