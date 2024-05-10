import { Category } from "@models/categories/category.model";
import { Media } from "@models/media/media.model";
import { Tag } from "@models/tags/tag.model";

export interface Book {
  id: string;
  title: string;
  price: number;
  discount?: number;
  description?: string;
  availableQuantity?: number;

  categories?: Category[];
  tags?: Tag[];
  media?: Media[];

  createdAt: string;
  ratings?: number;
  archivedAt?: string;
  deletedAt?: string;
}

