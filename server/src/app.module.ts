import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { BillsModule } from './bills/bills.module';
import { BankModule } from './bank/bank.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './guard/role.guard';

const FULL_MONGO_URI =
	(process.env.MONGO_BASE_URL || 'mongodb+srv://') +
	(process.env.MONGO_USER || 'root') +
	':' +
	(process.env.MONGO_PASSWORD || 'G8AeZ4VrfgsZLBxB') +
	(process.env.MONGO_URI ||
		'@cluster0.kzfwgt7.mongodb.net/?retryWrites=true&w=majority');

@Module({
	imports: [
		ConfigModule.forRoot(),
		MongooseModule.forRoot(FULL_MONGO_URI),
		UsersModule,
		AuthModule,
		ProductsModule,
		BillsModule,
		BankModule,
	],
	controllers: [AppController],
	providers: [
		AppService,
		{
			provide: APP_GUARD,
			useClass: RolesGuard,
		},
	],
})
export class AppModule {}
