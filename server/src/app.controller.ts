import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get()
	getHello(): string {
		return this.appService.getHello();
	}

	@Get('client.apk')
	downloadClient(@Res() res: Response) {
		const pathApk = this.appService.getClient();
		return res.sendFile(pathApk);
	}
}
