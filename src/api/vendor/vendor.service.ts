import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { Vendor } from './schema/vendor.schema';
import { ErrorHandlerService } from 'src/utils/error-handler.service';
import { CreateVendorResponse, GetVendorByIdResponse, GetVendorListResponse, UpdateVendorResponse } from './dto/vendor-response';
import { GetVendorListDto } from './dto/get-vendor-list.dto';
import { MESSGES } from 'src/constant/messages';
import { ResponseDto } from 'src/utils/response.dto';

@Injectable()
export class VendorService {
  constructor(
    @InjectModel(Vendor.name) private readonly vendorModel: Model<Vendor>,
    private readonly errorHandlerService: ErrorHandlerService
  ) { }

  // Create a new vendor
  async createVendor(createVendorDto: CreateVendorDto): Promise<CreateVendorResponse> {
    try {
      const { companyName, companyAddress, companyPhone, userId } = createVendorDto;
      const existsVendor = await this.vendorModel.findOne({ companyName, companyAddress, companyPhone, userId });
      if (existsVendor) {
        throw new HttpException(MESSGES.VENDOR_ALREADY_EXISTS_MESSAGE, HttpStatus.BAD_REQUEST);
      }

      const newVendor = await this.vendorModel.create({
        companyName,
        companyAddress,
        companyPhone,
        userId
      });
      return {
        statusCode: HttpStatus.CREATED,
        message: MESSGES.VENDOR_CREATE_MESSAGE,
        data: newVendor
      }
    } catch (error) {
      await this.errorHandlerService.HttpException(error);
    }
  }

  async getVendorList(getVendorListDto: GetVendorListDto): Promise<GetVendorListResponse> {
    try {
      const { limit, page, search} = getVendorListDto;

      const skip = (page - 1) * limit;

      const facetArray = [
        { $skip: skip },
        { $limit: limit },
      ];

      const getVendorList = await this.vendorModel.aggregate([
        {
          $match: {
            companyName: { $regex: search, $options: 'i' },
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
      ]);

      return {
        statusCode: HttpStatus.OK,
        message:MESSGES.VENDOR_LIST_FETCH_SUCCESS_MESSAGE,
        totalCount: getVendorList[0].count[0]?.totalCount,
        data: getVendorList,
      };
    } catch (error) {
      await this.errorHandlerService.HttpException(error);
    }
  }

// get vendor by id
  async getVendorById(vendorId: string): Promise<GetVendorByIdResponse> {
    try {
      const vendor = await this.vendorModel.findById(vendorId);
      return {
        statusCode: HttpStatus.OK,
        message: MESSGES.VENDOR_FETCH_SUCCESS_MESSAGE,
        data: vendor
      }
    } catch (error) {
      await this.errorHandlerService.HttpException(error);
    }
  }

  // Update vendor by id
  async updateVendorByVendorId(vendorId: string, updateVendorDto: UpdateVendorDto): Promise<UpdateVendorResponse> {
    try {
      const updateVendor = await this.vendorModel.findOneAndUpdate({_id: vendorId}, updateVendorDto, { new: true });
      if (!updateVendor) {
        throw new HttpException(MESSGES.VENDOR_NOT_FOUND_MESSAGE, HttpStatus.NOT_FOUND);
      }
      return {
        statusCode: HttpStatus.OK,
        message: MESSGES.VENDOR_UPDATE_MESSAGE,
        data: updateVendor
      }
    } catch (error) {
      await this.errorHandlerService.HttpException(error);
    }
  }

  // Delete vendor by id
  async deleteVendor(vendorId: string): Promise<ResponseDto> {
    try {
      const deleteVendor = await this.vendorModel.findOneAndDelete({_id: vendorId});
      if (!deleteVendor) {
        throw new HttpException(MESSGES.VENDOR_NOT_FOUND_MESSAGE, HttpStatus.NOT_FOUND);
      }
      return {
        statusCode: HttpStatus.OK,
        message:MESSGES.VENDOR_DELETE_MESSAGE,
      }
    } catch (error) {
      await this.errorHandlerService.HttpException(error);
    }
  }
}
