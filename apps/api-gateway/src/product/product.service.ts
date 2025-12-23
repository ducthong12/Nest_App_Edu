import { NAME_SERVICE_GRPC } from '@common/constants/port-grpc.constant';
import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { ProductGrpcDto } from 'common/dto/grpc/product-grpc.dto';
import { CreateBrandDto } from 'common/dto/product/create-brand.dto';
import { CreateCategoryDto } from 'common/dto/product/create-category.dto';
import { CreateProductDto } from 'common/dto/product/create-product.dto';

@Injectable()
export class ProductService {
  private productService: ProductGrpcDto;

  constructor(
    @Inject(NAME_SERVICE_GRPC.PRODUCT_SERVICE) private client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.productService = this.client.getService<ProductGrpcDto>(
      NAME_SERVICE_GRPC.PRODUCT_SERVICE,
    );
  }

  createProduct(createProductDto: CreateProductDto) {
    return this.productService.createProduct(createProductDto);
  }

  findAllProducts() {
    return this.productService.findAllProducts({});
  }

  findOneProduct(id: number) {
    return this.productService.findOneProduct({ id });
  }

  createCategory(createCategoryDto: CreateCategoryDto) {
    return this.productService.createCategory(createCategoryDto);
  }

  createBrand(createBrandDto: CreateBrandDto) {
    return this.productService.createBrand(createBrandDto);
  }

  // updateProduct(id: number, updateProductDto: UpdateProductDto) {
  //   return this.productService.updateProduct({ id, ...updateProductDto });
  // }

  // removeProduct(id: number) {
  //   return this.productService.removeProduct({ id });
  // }
}
