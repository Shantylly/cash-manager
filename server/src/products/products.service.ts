import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './product.schema';
import { Model, Types } from 'mongoose';
import { CreateProductDto } from './dto/createProduct.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';

@Injectable()
export class ProductsService {
	constructor(
		@InjectModel(Product.name)
		private productModel: Model<Product>,
	) {}

	async create(createProductDto: CreateProductDto): Promise<Product> {
		createProductDto.seller_id = new Types.ObjectId(
			createProductDto.seller_id,
		);
		const createdProduct = new this.productModel(createProductDto);
		return createdProduct.save();
	}

	async update(
		id: string,
		updateProductDto: UpdateProductDto,
	): Promise<Product | null> {
		return this.productModel.findByIdAndUpdate(id, updateProductDto, {
			new: true,
		});
	}

	async delete(id: string): Promise<Product | null> {
		const result = await this.productModel.findByIdAndDelete(id).exec();
		return result ? (result as unknown as Product) : null;
	}

	async findAll(): Promise<Product[]> {
		return this.productModel.find().exec();
	}

	async findOne(id: string): Promise<Product | null> {
		return this.productModel.findById(id);
	}
}
