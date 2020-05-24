import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { CustomerController } from './customer.controller';

@Module({
  imports: [AuthModule],
  controllers: [CustomerController],
})
export class CustomerModule {}
