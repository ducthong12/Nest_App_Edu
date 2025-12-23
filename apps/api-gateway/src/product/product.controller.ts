import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from 'common/dto/product/create-product.dto';
import { CreateCategoryDto } from 'common/dto/product/create-category.dto';
import { CreateBrandDto } from 'common/dto/product/create-brand.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('createProduct')
  createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productService.createProduct(createProductDto);
  }

  @Get('findAllProducts')
  findAllProducts() {
    return this.productService.findAllProducts();
  }

  @Get('findOneProduct')
  findOneProduct(id: number) {
    return this.productService.findOneProduct(id);
  }

  // @Patch('updateProduct')
  // updateProduct(updateProductDto: UpdateProductDto) {
  //   return this.productService.updateProduct(
  //     updateProductDto.id,
  //     updateProductDto,
  //   );
  // }

  // @Delete('removeProduct')
  // removeProduct(id: number) {
  //   return this.productService.removeProduct(id);
  // }

  @Post('createBrand')
  createBrand(@Body() createBrandDto: CreateBrandDto) {
    return this.productService.createBrand(createBrandDto);
  }

  @Post('createCategory')
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.productService.createCategory(createCategoryDto);
  }
}
