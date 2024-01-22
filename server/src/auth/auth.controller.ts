import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Post('login')
	@ApiResponse({ status: 201, description: 'Login successful' })
	@ApiResponse({ status: 401, description: 'Unauthorized' })
	async login(@Body() loginDto: LoginDto) {
		return this.authService.login(loginDto);
	}

	@Post('register')
	@ApiResponse({ status: 201, description: 'Registration successful' })
	@ApiResponse({ status: 400, description: 'Bad Request' })
	async register(@Body() registerDto: RegisterDto) {
		return this.authService.register(registerDto);
	}
}
