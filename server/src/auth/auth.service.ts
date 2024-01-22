import {
	BadRequestException,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
	constructor(
		private usersService: UsersService,
		private jwtService: JwtService,
	) {}

	async login(loginDto: LoginDto): Promise<{ access_token: string }> {
		const user = await this.usersService.findOneByUsername(
			loginDto.username,
		);
		if (user && bcrypt.compareSync(loginDto.password, user.password)) {
			const payload = {
				username: user.username,
				sub: user._id,
				isAdmin: user.roles,
				balance: user.balance,
			};
			return {
				access_token: this.jwtService.sign(payload, {
					secret: process.env.JWT_SECRET,
				}),
			};
		}
		console.error(
			'Error while logging in user: Passwords do not match or user does not exist',
		);
		throw new UnauthorizedException();
	}

	async register(registerDto: RegisterDto): Promise<any> {
		try {
			if (
				(await this.usersService.userExists(
					registerDto.username,
					registerDto.email,
				)) === true
			) {
				console.error('User email or username already exists');
				throw new BadRequestException();
			}
			const hashedPassword = await bcrypt.hash(
				registerDto.password,
				Number(process.env.BCRYPT_SALT),
			);
			registerDto.password = hashedPassword;
			const user = await this.usersService.create(registerDto);
			if (user) {
				const payload = {
					username: user.username,
					sub: user._id,
					roles: user.roles,
					balance: user.balance,
				};
				return {
					access_token: this.jwtService.sign(payload, {
						secret: process.env.JWT_SECRET,
					}),
				};
			}
		} catch (e) {
			console.error('Error while registering user: ', e);
			throw new BadRequestException();
		}
	}
}
