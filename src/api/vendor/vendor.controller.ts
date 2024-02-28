import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { VendorService } from './vendor.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { CreateVendorResponse, GetVendorByIdResponse, GetVendorListResponse, UpdateVendorResponse } from './dto/vendor-response';
import { GetVendorListDto } from './dto/get-vendor-list.dto';
import { ResponseDto } from 'src/utils/response.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guard/role.guard ';
import { Roles } from '../auth/decorator/roles.decorator';
import { USER_ROLE } from 'src/enum/role.enum';

@ApiTags('Vendor')
@ApiBearerAuth()
@Controller('vendor')
export class VendorController {
  constructor(private readonly vendorService: VendorService) { }

  /**
   * create vendor endpoint
   * @param createVendorDto 
   * @returns CreateVendorResponse
   */
  @Post('createVendor')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(USER_ROLE.VENDOR)
  async createVendor(@Body() createVendorDto: CreateVendorDto): Promise<CreateVendorResponse> {
    return await this.vendorService.createVendor(createVendorDto);
  }

  /**
   * get vendor list endpoint
   * @returns GetVendorListResponse
   */
  @Get('getVendorList')
  async getVendorList(@Param() getVendorListDto: GetVendorListDto): Promise<GetVendorListResponse> {
    return await this.vendorService.getVendorList(getVendorListDto);
  }

  /**
   * get vendor by id endpoint
   * @param vendorId 
   * @returns GetVendorByIdResponse
   */
  @Get(':vendorId')
  async getVendorById(@Param('vendorId') vendorId: string): Promise<GetVendorByIdResponse> {
    return await this.vendorService.getVendorById(vendorId);
  }

  /**
   * update vendor by vendor id endpoint
   * @param vendorId 
   * @param updateVendorDto 
   * @returns UpdateVendorResponse
   */
  @Patch(':vendorId')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(USER_ROLE.VENDOR)
  async updateVendorByVendorId(@Param('vendorId') vendorId: string, @Body() updateVendorDto: UpdateVendorDto): Promise<UpdateVendorResponse> {
    return await this.vendorService.updateVendorByVendorId(vendorId, updateVendorDto);
  }

  /**
   * delete vendor by vendor id endpoint
   * @param vendorId 
   * @returns ResponseDto
   */
  @Delete(':vendorId')
  async deleteVendor(@Param('vendorId') vendorId: string): Promise<ResponseDto> {
    return await this.vendorService.deleteVendor(vendorId);
  }
}
