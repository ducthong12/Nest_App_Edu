import { Body, Controller, Post } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { RestockProductDto } from 'common/dto/restock/restock-product.dto';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post('restockProduct')
  restockProduct(@Body() restockProductDto: RestockProductDto) {
    return this.inventoryService.restockProduct(restockProductDto);
  }
}
