import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CommonApiService } from '@services/common/common-api.service';
import { CommonComponent } from '@components/abstract/common-component.component';
import { Component } from '@angular/core';
import { Inject } from '@angular/core';
import { ModelService } from '@services/common/model.service';
import { OnInit } from '@angular/core';
import { Lightbox } from 'ngx-lightbox';
import { AuthenticationService } from '@services/account/authentication.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Book } from '@models/books/book.model';
import { CartProduct } from '@models/cart/cart-product.model';
import { alertFire } from '@functions/alerts';
import { CommonVerbsApiService } from '@services/common/common-verbs-api.service';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.scss'],
})
export class BookDetailComponent extends CommonComponent implements OnInit {
  bookDetail: Book = <Book>{};
  quantity = 1;

  constructor(
    private router: Router,
    @Inject('BookService')
    public bookService: ModelService<Book>,
    public api: CommonApiService,
    private lightbox: Lightbox,
    public authenticationService: AuthenticationService,
    private toastr: ToastrService,
    private api2: CommonVerbsApiService

  ) {
    super();
  }

  ngOnInit(): void {
    const subscribe = this.bookService.model$.subscribe(value => {
      if (value != null) {
        this.load(value);
      }
    });
    this.unsubscribe.push(subscribe);
  }

  private load(model: Book) {
    this.bookDetail = model;
  }

  lightboxImage(url: string, caption = '') {
    const src = url;
    const thumb = 'tumb';
    const album =
      caption === ''
        ? { src: src, thumb: thumb }
        : { src: src, caption: caption, thumb: thumb };
    const _albums = [];
    _albums.push(album);
    this.lightbox.open(_albums, 0);
  }



  incrementQuantity() {
    if (this.quantity === this.bookDetail.availableQuantity) {
      return;
    } else if (this.quantity > this.bookDetail.availableQuantity) {
      this.quantity = this.bookDetail.availableQuantity;
    } else {
      this.quantity++;
    }
  }

  decrementQuantity() {
    if (this.quantity === 1) {
      return;
    } else if (this.quantity < 1) {
      this.quantity = 1;
    } else {
      this.quantity--;
    }
  }



  addToCart() {
    alertFire('Estas seguro ?').then(result => {
      if (result.value) {
        if (this.authenticationService.authService.model) {
          const productData = {
            productId: this.bookDetail.id,
            userId: this.authenticationService.authService.model.id,
            quantity: this.quantity
          };
          this.api2.post(`cart-products/add-product`, productData)
            .subscribe(r => {
              if (r) {
                this.toastr.success('Producto añadido satisfacotriamente.')
              }
            },
              error => {
                this.toastr.error('La cantidad es invalida!' || error || error?.error || error?.error?.message);
              });
        } else {
          const productData = {
            product: this.bookDetail,
            userId: null,
            quantity: this.quantity,
          };

          const cart = this.getCartFromLocalStorage();
          const cartProducts = cart.filter(p => p.book.id === this.bookDetail.id);
          const cartProductTotalQuantity = cartProducts.reduce((total, product) => total + product.quantity, 0);
          let productMatch = false;

          if (this.bookDetail.availableQuantity < this.quantity + cartProductTotalQuantity) {
            this.toastr.error('La cantidad es invalida!');
            return;
          }
          if (cart.length > 0) {
            if (!productMatch) {
              cart.unshift(productData);
              localStorage.setItem('cart', JSON.stringify(cart));
              this.toastr.success('Producto añadido satisfacotriamente.')
            }
          } else {
            cart.unshift(productData);
            localStorage.setItem('cart', JSON.stringify(cart));
            this.toastr.success('Producto añadido satisfacotriamente.')
          }
        }
      }
    });
  }



  getCartFromLocalStorage(): CartProduct[] {
    const cartItemsJSON = localStorage.getItem('cart');
    if (cartItemsJSON) {
      return JSON.parse(cartItemsJSON);
    } else {
      return [];
    }
  }



}
