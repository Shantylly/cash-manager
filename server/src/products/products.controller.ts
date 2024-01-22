import {
	Controller,
	Param,
	Get,
	Post,
	Patch,
	Delete,
	Body,
	NotFoundException,
	BadRequestException,
	Req,
	UnauthorizedException,
	UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/createProduct.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';
import { Types } from 'mongoose';
import { Roles } from '../decorator/role.decorator';
import { Role } from '../model/enum/role.enum';
import { ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '../auth/auth.guard';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
	constructor(
		private readonly productsService: ProductsService,
		private readonly jwtService: JwtService,
	) {}

	// Get products controller
	@ApiResponse({ status: 200, description: 'Get products successful' })
	@ApiResponse({ status: 401, description: 'Unauthorized' })
	@ApiResponse({ status: 500, description: 'Internal server error' })
	@Get()
	async findAll() {
		return this.productsService.findAll();
	}

	// Get product controller
	@ApiResponse({ status: 200, description: 'Get product successful' })
	@ApiResponse({ status: 401, description: 'Unauthorized' })
	@ApiResponse({ status: 500, description: 'Internal server error' })
	@Get(':id')
	async findOne(@Param('id') productId: string) {
		return this.productsService.findOne(productId);
	}

	// Create controller
	@ApiHeader({
		name: 'Authorization',
		description: 'Bearer {token}',
	})
	@ApiResponse({ status: 200, description: 'Create product successful' })
	@ApiResponse({ status: 401, description: 'Unauthorized' })
	@ApiResponse({ status: 404, description: 'Error: seller_id not found' })
	@UseGuards(AuthGuard)
	@Post('create')
	async create(@Body() createProductDto: CreateProductDto) {
		if (Types.ObjectId.isValid(createProductDto.seller_id)) {
			const createdProduct =
				await this.productsService.create(createProductDto);
			return {
				message: 'Product created successfully',
				product: createdProduct,
			};
		} else {
			throw new NotFoundException('Seller not found');
		}
	}

	// Update controller
	@ApiHeader({
		name: 'Authorization',
		description: 'Bearer {token}',
	})
	@ApiResponse({ status: 200, description: 'Update product successful' })
	@ApiResponse({ status: 400, description: 'User id is not seller id' })
	@ApiResponse({ status: 400, description: 'Cannot modify seller_id' })
	@ApiResponse({ status: 401, description: 'Unauthorized' })
	@ApiResponse({ status: 404, description: 'Error: product_id not found' })
	@UseGuards(AuthGuard)
	@Patch(':id')
	async update(
		@Param('id') productId: string,
		@Body() updateProductDto: UpdateProductDto,
		@Req() request: { headers: { authorization?: string } } & Request,
	) {
		const existingProduct = await this.productsService.findOne(productId);

		if (!existingProduct) {
			throw new NotFoundException('Product not found');
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

		if (existingProduct.seller_id.toString() !== user_id) {
			throw new BadRequestException(
				'You are not authorized to update this product',
			);
		}

		for (const key of Object.keys(updateProductDto)) {
			if (key === 'seller_id') {
				throw new BadRequestException('Cannot modify seller_id');
			}
		}

		const updatedProduct = await this.productsService.update(
			productId,
			updateProductDto,
		);

		if (updatedProduct) {
			return {
				message: 'Product updated successfully',
				product: updatedProduct,
			};
		} else {
			throw new NotFoundException('Product not found');
		}
	}

	//Admin delete controller
	@ApiHeader({
		name: 'Authorization',
		description: 'Bearer {token}',
	})
	@ApiResponse({ status: 200, description: 'Delete product successful' })
	@ApiResponse({ status: 401, description: 'Unauthorized' })
	@ApiResponse({ status: 404, description: 'Error: product_id not found' })
	@Roles(Role.Admin)
	@UseGuards(AuthGuard)
	@Delete(':id')
	async remove_admin(@Param('id') productId: string) {
		const deletedProduct = await this.productsService.delete(productId);
		if (deletedProduct) {
			return { message: 'Product deleted successfully' };
		} else {
			// Handle the case where the product with the specified ID was not found.
			throw new NotFoundException('Product not found');
		}
	}

	// Seller delete controller
	@ApiHeader({
		name: 'Authorization',
		description: 'Bearer {token}',
	})
	@ApiResponse({ status: 200, description: 'Delete product successful' })
	@ApiResponse({ status: 401, description: 'Unauthorized' })
	@ApiResponse({ status: 404, description: 'Error: product_id not found' })
	@UseGuards(AuthGuard)
	@Delete(':id')
	async remove(
		@Param('id') productId: string,
		@Req() request: { headers: { authorization: string } },
	) {
		const existingProduct = await this.productsService.findOne(productId);

		if (!existingProduct) {
			throw new NotFoundException('Product not found');
		}

		const token = request.headers.authorization.split(' ')[1];
		const decode = this.jwtService.decode(token);
		const user_id = decode['sub'];

		if (existingProduct.seller_id.toString() !== user_id) {
			throw new BadRequestException(
				'You are not authorized to delete this product',
			);
		}

		const deletedProduct = await this.productsService.delete(productId);
		if (deletedProduct) {
			return { message: 'Product deleted successfully' };
		} else {
			throw new NotFoundException('Product not found');
		}
	}
}
