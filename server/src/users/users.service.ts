import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model, ProjectionType } from 'mongoose';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';

@Injectable()
export class UsersService {
	constructor(
		@InjectModel(User.name)
		private userModel: Model<User>,
	) {}

	async create(createUserDto: CreateUserDto): Promise<User> {
		const createdUser = new this.userModel(createUserDto);
		return createdUser.save();
	}

	async findAll(): Promise<User[]> {
		return this.userModel.find().exec();
	}

	async findOneById(
		id: string,
		projection?: ProjectionType<User>,
	): Promise<User | null> {
		return this.userModel.findOne({ _id: id }, projection);
	}

	async findOneByUsername(
		username: string,
		projection?: ProjectionType<User>,
	): Promise<User | null> {
		return this.userModel.findOne({ username: username }, projection);
	}

	async findOneByEmail(
		email: string,
		projection?: ProjectionType<User>,
	): Promise<User | null> {
		return this.userModel.findOne({ email: email }, projection);
	}

	async userExists(username: string, email: string): Promise<boolean> {
		let user = await this.findOneByEmail(email);
		if (user) {
			return true;
		}
		user = await this.findOneByUsername(username);
		if (user) {
			return true;
		}
		return false;
	}

	async update(
		id: string,
		updateUserDto: UpdateUserDto,
	): Promise<User | null> {
		const res = await this.userModel.updateOne({ _id: id }, updateUserDto);
		if (res) {
			return this.findOneById(id);
		} else {
			throw BadRequestException;
		}
	}

	async delete(id: string): Promise<User | null> {
		const result = await this.userModel.findByIdAndDelete(id).exec();
		return result ? (result as unknown as User) : null;
	}
}
