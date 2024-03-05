import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, mongo } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './schema/product.schema';
import { ErrorHandlerService } from 'src/utils/error-handler.service';
import { MESSAGES } from 'src/constant/messages';
import { S3HelperService } from 'src/helper/s3-helper.service';
import { GetProductListDto } from './dto/getProductList.dto';
import {
  CreateProductResponse,
  GetProductDetailResponse,
  GetProductListResponse,
} from './dto/product-response';
import { ResponseDto } from 'src/utils/response.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    private errorHandlerService: ErrorHandlerService,
    private s3HelperService: S3HelperService,
  ) { }

  async createProduct(
    createProductDto: CreateProductDto,
    file,
  ): Promise<CreateProductResponse> {
    try {
      const existsProduct = await this.productModel.findOne({
        name: createProductDto.name,
      });
      if (existsProduct) {
        throw new HttpException(
          'Product already exists',
          HttpStatus.BAD_REQUEST,
        );
      }

      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.mimetype)) {
        throw new HttpException(
          MESSAGES.FILE_NOT_ALLOWED_MESSAGE,
          HttpStatus.BAD_REQUEST,
        );
      }
      file.originalname =
        `${createProductDto.name}` + '.' + file.mimetype.split('/')[1];

      const url = await this.s3HelperService.uploadFile(file, 'product');
      createProductDto.image = url;

      const createProduct = await this.productModel.create(createProductDto);
      return {
        statusCode: HttpStatus.CREATED,
        message: MESSAGES.PRODUCT_CREATE_MESSAGE,
        data: createProduct,
      };
    } catch (error) {
      await this.errorHandlerService.HttpException(error);
    }
  }

  // get product list by category with search and pagination
  async getProductListByCategory(
    getProductListDto: GetProductListDto,
  ): Promise<GetProductListResponse> {
    try {
      const { category, search, page, limit } = getProductListDto;
      const skip = (page - 1) * limit;
      const facetArray = [
        {
          $skip: skip,
        },
        {
          $limit: limit,
        },
      ];
      const [productList] = await this.productModel
        .aggregate([
          {
            $match: {
              $and: [
                { category: new mongoose.Types.ObjectId(category) },
                { name: { $regex: `${search}`, $options: 'i' } },
              ],
            },
          },
          {
            $lookup: {
              from: 'vendors',
              localField: 'vendor',
              foreignField: '_id',
              as: 'vendor',
            },
          },
          {
            $unwind: {
              path: '$vendor',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $facet: {
              data: facetArray,
              count: [
                {
                  $count: 'totalCount',
                },
              ],
            },
          },
        ])
        .exec();

      return {
        statusCode: HttpStatus.OK,
        message: MESSAGES.PRODUCT_LIST_FETCH_SUCCESS,
        totalCount:
          productList.count.length == 0 ? 0 : productList.count[0].totalCount,
        data: productList.data,
      };
    } catch (error) {
      await this.errorHandlerService.HttpException(error);
    }
  }

  async getProductDetailById(
    productId: string,
  ): Promise<GetProductDetailResponse> {
    try {
      const productList = await this.productModel.findOne({ _id: productId });
      return {
        statusCode: HttpStatus.OK,
        message: MESSAGES.PRODUCT_FETCH_SUCCESS,
        data: productList,
      };
    } catch (error) {
      await this.errorHandlerService.HttpException(error);
    }
  }

  //update product
  async updateProduct(
    productId: string,
    updateProductDto: UpdateProductDto,
    file,
  ): Promise<CreateProductResponse> {
    try {
      const product = await this.productModel.findById(productId);

      if (!product) {
        throw new HttpException('Product not found', HttpStatus.BAD_REQUEST);
      }

      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];

      if (!allowedTypes.includes(file.mimetype)) {
        throw new HttpException(
          MESSAGES.FILE_NOT_ALLOWED_MESSAGE,
          HttpStatus.BAD_REQUEST,
        );
      }

      file.originalname = `${updateProductDto.name}.${file.mimetype.split('/')[1]}`;
      const url = await this.s3HelperService.uploadFile(file, 'product');

      updateProductDto.image = url;

      await this.productModel.updateOne({ _id: productId }, updateProductDto, {
        new: true,
      });

      return {
        statusCode: HttpStatus.OK,
        message: MESSAGES.PRODUCT_UPDATE_MESSAGE,
        data: product,
      };
    } catch (error) {
      await this.errorHandlerService.HttpException(error);
    }
  }

  //delete product
  async deleteProduct(productId: string): Promise<ResponseDto> {
    try {
      const deleteProduct =
        await this.productModel.findByIdAndDelete(productId);
      if (!deleteProduct) {
        throw new HttpException('Product not found', HttpStatus.BAD_REQUEST);
      }
      return {
        statusCode: HttpStatus.OK,
        message: MESSAGES.PRODUCT_DELETE_MESSAGE,
      };
    } catch (error) {
      await this.errorHandlerService.HttpException(error);
    }
  }
}
