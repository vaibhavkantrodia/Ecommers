import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { Category, CategorySchema } from './schema/category.schema';
import { S3HelperService } from 'src/helper/s3-helper.service';
import { ErrorHandlerService } from 'src/utils/error-handler.service';
import { User, UserSchema } from '../user/schema/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
      { name: User.name, schema: UserSchema }
    ]),
  ],
  controllers: [CategoryController],
  providers: [CategoryService, ErrorHandlerService, S3HelperService, JwtService],
})
export class CategoryModule { }
