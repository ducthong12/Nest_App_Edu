import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Brand } from './brand.schema';
import { Category } from './category.schema';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true, index: true }) // Index để search tên cho nhanh
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  price: number; // Trong JS/TS, số là Number (tương đương Float trong DB)

  @Prop({ required: true, unique: true }) // SKU không được trùng
  sku: string;

  @Prop()
  imageUrl: string;

  @Prop({ default: true })
  isActive: boolean;

  // --- External Reference (Identity Service) ---
  @Prop({ type: Number, index: true }) // Lưu ID từ Postgres, đánh index để query theo user nhanh
  userId: number;

  // --- Internal Relations (MongoDB) ---
  // Lưu ObjectId nhưng trỏ tới (ref) Schema Brand
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Brand' })
  brand: Brand;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  })
  category: Category;

  // --- Stats (Denormalization) ---
  @Prop({ default: 0 })
  likesCount: number;

  @Prop({ default: 0 })
  viewCount: number;

  @Prop({ default: 0.0 })
  rating: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

// Index text để phục vụ chức năng tìm kiếm sản phẩm cơ bản
ProductSchema.index({ name: 'text', description: 'text' });
