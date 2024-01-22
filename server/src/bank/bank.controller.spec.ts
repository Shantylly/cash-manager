import { Test, TestingModule } from '@nestjs/testing';
import { BankController } from './bank.controller';
import { BankService } from './bank.service';
import { Bank } from './bank.schema';
import { User } from '../users/user.schema';
import { Bill } from '../bills/bill.schema';
import { Product } from '../products/product.schema';
import { JwtService } from '@nestjs/jwt';
import { Model, Types } from 'mongoose';
import { ObjectId } from 'mongodb';

describe('BankController', () => {
    let controller: BankController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [BankController],
            providers: [
                BankService,
                JwtService,
                {
                    provide: 'BankModel',
                    useFactory: () => {
                        return Model<Bank>;
                    },
                },
                {
                    provide: 'UserModel',
                    useFactory: () => {
                        return User;
                    },
                },
                {
                    provide: 'BillModel',
                    useFactory: () => {
                        return Bill;
                    },
                },
                {
                    provide: 'ProductModel',
                    useFactory: () => {
                        return Product;
                    },
                },
            ],
        }).compile();

        controller = module.get<BankController>(BankController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('findAll', () => {
        it('should get bank amount', async () => {
            const result: Bank[] = [
				{
				    _id: '1',
				    name: 'EpiBank',
				    amount: 1000000,
				} as Bank,
            ];

            jest.spyOn(controller, 'findAll').mockImplementation(
                async () => result,
            );
            expect(await controller.findAll()).toBe(result);
        });

        it('should throw error when user is not admin', async () => {
            jest.spyOn(controller, 'findAll').mockImplementation(async () => {
                throw new Error('Unauthorized');
            });

            try {
                await controller.findAll();
            } catch (error) {
                expect(error.message).toEqual('Unauthorized');
            }
        });
    });

    describe('addMoney', () => {});
});
