import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { GetCategoryListDto } from './dto/get-category-list.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @Post('/createCategory')
  @UseInterceptors(FileInterceptor('file'))
  async create(@Body() createCategoryDto: CreateCategoryDto, @UploadedFile() file: any) {
    return await this.categoryService.createCategory(createCategoryDto, file);
  }

  @Get('/categoryList')
  async getCategoryList(@Body() getCategoryListDto: GetCategoryListDto) {
    return await this.categoryService.getCategoryList(getCategoryListDto);
  }

  @Get(':categoryId')
  async findOne(@Param('categoryId') categoryId: string) {
    return await this.categoryService.getCateogoryById(categoryId);
  }

  @Patch(':categoryId')
  @UseInterceptors(FileInterceptor('file'))
  async update(@Body() updateCategoryDto: UpdateCategoryDto, file: any) {
    return await this.categoryService.updateCategory(updateCategoryDto, file);
  }

  @Delete(':categoryId')
  async remove(@Param('categoryId') categoryId: string) {
    return await this.categoryService.removeCategory(categoryId);
  }
}
