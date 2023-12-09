import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { S3HelperService } from 'src/helper/s3-helper.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './schema/category.schema';
import { ErrorHandlerService } from 'src/utils/error-handler.service';
import { ResponseDto } from 'src/utils/response.dto';
import { MESSGES } from 'src/constant/messages';
import { GetCategoryListDto } from './dto/get-category-list.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
    private readonly s3HelperService: S3HelperService,
    private readonly errorHandlerService: ErrorHandlerService,
  ) { }

  // create category
  async createCategory(createCategoryDto: CreateCategoryDto, file: any):Promise<ResponseDto> {
    try {
      const { name, image } = createCategoryDto;

      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.mimetype)) {
        throw new HttpException(MESSGES.FILE_NOT_ALLOWED_MESSAGE, HttpStatus.BAD_REQUEST);
      }
      file.originalname = `${name}` + '.' + file.mimetype.split('/')[1];

      const url = await this.s3HelperService.uploadFile(file, 'category');

      const category = await this.categoryModel.create({ name, image: url });

      return {
        statusCode: 200,
        message:MESSGES.CATEGORY_CREATE_MESSAGE,
        data: category,
      };
    } catch (error) {
      await this.errorHandlerService.HttpException(error);
    }
  }

  // get Category list
  async getCategoryList(getCategoryListDto:GetCategoryListDto): Promise<ResponseDto> {
    try {
      const{page, limit, totalCount} = getCategoryListDto;

      // pagination with totalCount and limit
      const category = await this.categoryModel.find().skip((page - 1) * limit).limit(limit);
      const totalCategory = await this.categoryModel.countDocuments();
      return {
        statusCode: 200,
        message: MESSGES.CATEGORY_LIST_FETCH_SUCCESS_MESSAGE,
        data: {category,totalCount: totalCategory},
      };
    } catch (error) {
      await this.errorHandlerService.HttpException(error);
    }
  }

  // get category by id
  async getCateogoryById(categoryId: string):Promise<ResponseDto> {
    try {
      const category = await this.categoryModel.findById({ _id: categoryId });
      return {
        statusCode: 200,
        message: MESSGES.CATEGORY_FETCH_SUCCESS_MESSAGE,
        data: category,
      };
    } catch (error) {
      await this.errorHandlerService.HttpException(error);
    }
  }

  // update category
  async updateCategory( updateCategoryDto: UpdateCategoryDto, file: any):Promise<ResponseDto> {
    try {
      const { name, image } = updateCategoryDto;
      const category = await this.categoryModel.findById({ _id: updateCategoryDto.categoryId });
      if (!category) {
        throw new HttpException(MESSGES.CATEGORY_NOT_FOUND_MESSAGE, HttpStatus.NOT_FOUND);
      }

      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.mimetype)) {
        throw new HttpException(MESSGES.FILE_NOT_ALLOWED_MESSAGE, HttpStatus.BAD_REQUEST);
      }
      // delete previous image
      if (category.image) {
       const test = await this.s3HelperService.deleteFile({file:category.image}, 'category'); 
       console.log("🚀 ~ file: category.service.ts:93 ~ CategoryService ~ updateCategory ~ test:", test)
      }

        file.originalname = `${name}` + '.' + file.mimetype.split('/')[1];
        const url = await this.s3HelperService.uploadFile(file, 'category');
        
        category.image = url;
        category.name = name;
        await category.save();
      
      return {
        statusCode: 200,
        message: MESSGES.CATEGORY_UPDATE_MESSAGE,
        data: category,
      };
    } catch (error) {
      await this.errorHandlerService.HttpException(error);
    }
  }

  // remove category
 async removeCategory(categoryId: string):Promise<ResponseDto> {
    try {
      const category = await this.categoryModel.findByIdAndDelete({_id: categoryId});
      if (!category) {
        throw new HttpException(MESSGES.CATEGORY_NOT_FOUND_MESSAGE, HttpStatus.NOT_FOUND);
      }
        return {
        statusCode: 200,
        message: MESSGES.CATEGORY_DELETE_MESSAGE,
      };
    } catch (error) {
      await this.errorHandlerService.HttpException(error);
    }
  }
}
