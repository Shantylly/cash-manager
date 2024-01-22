import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ApiResponse } from '@nestjs/swagger';

import { Bank } from './bank.schema';
import { User } from '../users/user.schema';
import { Bill } from '../bills/bill.schema';
import { Role } from '../model/enum/role.enum';
import { Product } from '../products/product.schema';

@Injectable()
export class BankService {
    constructor(
		@InjectModel(Bank.name) private bankModel: Model<Bank>,
		@InjectModel(User.name) private userModel: Model<User>,
		@InjectModel(Bill.name) private billModel: Model<Bill>,
		@InjectModel(Product.name) private productModel: Model<Product>,
    ) {}

	@ApiResponse({ status: 200, description: 'Get bank amount successful' })
    async getBankAmount(): Promise<Bank[]> {
        return this.bankModel.find().exec();
    }

	async handlePayment(billId: Types.ObjectId, type: 'NFC' | 'QR' | 'none') {
	    const bank = await this.bankModel.findOne().exec();
	    if (!bank) {
	        throw new NotFoundException('Bank not found');
	    }

	    const bill = await this.billModel.findById(billId).exec();
	    if (!bill) {
	        throw new NotFoundException('Bill not found');
	    }
	    if (bill.status != 'Pending') {
	        throw new BadRequestException('Bill is already paid');
	    }

	    const buyer = await this.userModel.findById(bill.user_id).exec();
	    if (!buyer) {
	        throw new NotFoundException('User not found');
	    }

	    if (buyer.balance < bill.amount) {
	        throw new BadRequestException('Not enough money');
	    }

	    for (const productId of bill.products) {
	        const product = await this.productModel.findById(productId).exec();
	        if (!product) {
	            throw new NotFoundException('Product not found');
	        }

	        const seller = await this.userModel
	            .findById(product.seller_id)
	            .exec();
	        if (!seller) {
	            throw new NotFoundException('Seller not found');
	        }

	        // Deduct money from buyer
	        buyer.balance -= product.price;
	        await buyer.save();

	        // Add money to the seller or bank based on roles
	        if (seller.roles === Role.Admin) {
	            bank.amount += product.price;
	            await bank.save();
	        } else {
	            seller.balance += product.price;
	            await seller.save();
	        }

	        // Create a bill for the seller with only one product
	        const sellerReceiptDto = {
	            user_id: seller._id,
	            timestamp: Date.now(),
	            type: type,
	            amount: product.price,
	            status: 'Deposit',
	            products: [productId],
	        };

	        const sellerReceipt = new this.billModel(sellerReceiptDto);
	        await sellerReceipt.save();
	    }
	    buyer.save();

	    bill.status = 'Paid';
	    bill.type = type;

	    bill.save();

	    return { message: 'Payment successful' };
	}

	async addMoney(userId: Types.ObjectId, amount: number) {
	    const bank = await this.bankModel.findOne().exec();
	    if (!bank) {
	        throw new NotFoundException('Bank not found');
	    }
	    const user = await this.userModel.findById(userId).exec();
	    if (!user) {
	        throw new NotFoundException('User not found');
	    }
	    user.balance += amount;
	    bank.amount -= amount;

	    await user.save();
	    await bank.save();

	    return { message: 'Add money successful' };
	}

	async findOne(id: string): Promise<Bill | null> {
	    return this.bankModel.findById(id);
	}
}
