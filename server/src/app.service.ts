import { Injectable } from '@nestjs/common';
import * as path from 'path';

@Injectable()
export class AppService {
	getHello(): string {
		return 'Hello World!';
	}

	getClient(): string {
		return path.join(__dirname, '../build/app-debug.apk');
	}
}
