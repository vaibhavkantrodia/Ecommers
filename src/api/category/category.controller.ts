import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { GetCategoryListDto } from './dto/get-category-list.dto';
import { ResponseDto } from 'src/utils/response.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  /**
   * create category endpoint
   * @param createCategoryDto 
   * @param file 
   * @returns ResponseDto
   */
  @Post('/createCategory')
  @UseInterceptors(FileInterceptor('file'))
  async create(@Body() createCategoryDto: CreateCategoryDto, @UploadedFile() file: any): Promise<ResponseDto> {
    return await this.categoryService.createCategory(createCategoryDto, file);
  }

  /**
   * get category list endpoint
   * @param getCategoryListDto 
   * @returns ResponseDto
   */
  @Get('/categoryList')
  async getCategoryList(@Body() getCategoryListDto: GetCategoryListDto): Promise<ResponseDto> {
    return await this.categoryService.getCategoryList(getCategoryListDto);
  }

  /**
   * get category by id endpoint
   * @param categoryId 
   * @returns ResponseDto
   */
  @Get(':categoryId')
  async findOne(@Param('categoryId') categoryId: string): Promise<ResponseDto> {
    return await this.categoryService.getCateogoryById(categoryId);
  }

  /**
   * update category endpoint
   * @param updateCategoryDto 
   * @param file 
   * @returns ResponseDto
   */
  @Patch(':categoryId')
  @UseInterceptors(FileInterceptor('file'))
  async update(@Body() updateCategoryDto: UpdateCategoryDto, file: any): Promise<ResponseDto> {
    return await this.categoryService.updateCategory(updateCategoryDto, file);
  }

  /**
   * remove category endpoint
   * @param categoryId 
   * @returns ResponseDto
   */
  @Delete(':categoryId')
  async remove(@Param('categoryId') categoryId: string): Promise<ResponseDto> {
    return await this.categoryService.removeCategory(categoryId);
  }
}
