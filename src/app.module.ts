import { Module } from '@nestjs/common';
import { AuthModule } from './api/auth/auth.module';
import { UserModule } from './api/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CategoryModule } from './api/category/category.module';
import { VendorModule } from './api/vendor/vendor.module';
import { CartModule } from './api/cart/cart.module';
import { ProductModule } from './api/product/product.module';

@Module({
  imports: [  
    ConfigModule.forRoot({
    envFilePath: '.env',
    isGlobal: true,
  }),
  MongooseModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => ({
      uri: configService.get('DB_URL'),
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: configService.get('DB_NAME'),
    }),
    inject: [ConfigService],
  }),
  AuthModule,
  UserModule,
  CategoryModule,
  VendorModule,
  ProductModule,
  CartModule
],
})
export class AppModule {}
