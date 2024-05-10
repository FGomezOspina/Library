import { Book } from "@models/books/book.model";
import { Order } from "@models/orders/order.model";

export interface OrderProduct {
  id?: string;
  book?: Book;
  order?: Order;
  quantity: number;

}

