import { Book } from "@models/books/book.model";

export interface CartProduct {
  id?: string;
  book?: Book;
  quantity: number;

  productId?: string;
  sizeId?: string;
  colorId?: string;
}

