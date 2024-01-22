import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Bank, BankSchema } from './bank.schema';
import { BankController } from './bank.controller';
import { BankService } from './bank.service';
import { User, UserSchema } from 'src/users/user.schema';
import { Bill, BillSchema } from 'src/bills/bill.schema';
import { Product, ProductSchema } from 'src/products/product.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Bank.name, schema: BankSchema }]),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        MongooseModule.forFeature([{ name: Bill.name, schema: BillSchema }]),
        MongooseModule.forFeature([
            { name: Product.name, schema: ProductSchema },
        ]),
    ],
    controllers: [BankController],
    providers: [BankService],
    exports: [BankService],
})
export class BankModule {}
