import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Bill } from './bill.schema';
import { Product } from '../products/product.schema';
import { Model, Types } from 'mongoose';
import { CreateBillDto } from './dto/createBill.dto';
import { UpdateBillDto } from './dto/updateBill.dto';

@Injectable()
export class BillsService {
	constructor(
		@InjectModel(Bill.name) private billModel: Model<Bill>,
		@InjectModel(Product.name) private productModel: Model<Product>,
	) {}

	async create(createBillDto: CreateBillDto): Promise<Bill> {
		const productIds = createBillDto.products.map(
			(productId) => new Types.ObjectId(productId),
		);
		createBillDto.user_id = new Types.ObjectId(createBillDto.user_id);

		const products = await this.productModel.find({
			_id: { $in: productIds },
		});

		const productQuantityMap = new Map<string, number>();
		createBillDto.products.forEach((productId) => {
			const stringProductId = String(productId);
			productQuantityMap.set(
				stringProductId,
				(productQuantityMap.get(stringProductId) || 0) + 1,
			);
		});

		const totalAmount = products.reduce((sum, product) => {
			const quantity = productQuantityMap.get(String(product._id)) || 0;
			return sum + product.price * quantity;
		}, 0);

		const defaultValues = {
			timestamp: Date.now(),
			amount: totalAmount,
			status: 'Pending',
		};

		const finalBillDto = {
			...defaultValues,
			...createBillDto,
			products: productIds,
		};

		const createdBill = new this.billModel(finalBillDto);

		return createdBill.save();
	}

	async update(
		id: string,
		updateBillDto: UpdateBillDto,
	): Promise<Bill | null> {
		if (updateBillDto.products) {
			const productIds = updateBillDto.products.map(
				(productId) => new Types.ObjectId(productId),
			);

			const products = await this.productModel.find({
				_id: { $in: productIds },
			});

			const productQuantityMap = new Map<string, number>();
			updateBillDto.products.forEach((productId) => {
				const stringProductId = String(productId);
				productQuantityMap.set(
					stringProductId,
					(productQuantityMap.get(stringProductId) || 0) + 1,
				);
			});

			const totalAmount = products.reduce((sum, product) => {
				const quantity =
					productQuantityMap.get(String(product._id)) || 0;
				return sum + product.price * quantity;
			}, 0);

			return this.billModel.findByIdAndUpdate(
				id,
				{
					...updateBillDto,
					amount: totalAmount,
					products: productIds,
				},
				{ new: true },
			);
		} else {
			return this.billModel.findByIdAndUpdate(id, updateBillDto, {
				new: true,
			});
		}
	}

	async findAll(): Promise<Bill[]> {
		return this.billModel.find().exec();
	}

	async findOne(id: string): Promise<Bill | null> {
		return this.billModel.findById(id);
	}

	async findAllByUser(userId: string): Promise<Bill[]> {
		const user_id = new Types.ObjectId(userId);
		return this.billModel.find({ user_id: user_id }).exec();
	}
}
