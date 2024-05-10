import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { getMenuByRole, getRouteByRole } from '@functions/routing';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationApiService } from '@services/account/authentication-api.service';
import { AuthenticationService } from '@services/account/authentication.service';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { CollectionComponent } from '@components/abstract/collection.component';
import { CollectionService } from '@services/common/collection.service';
import { CommonApiService } from '@services/common/common-api.service';
import { Location } from '@angular/common';
import { MenuItem } from '@models/layout/menu.model';
import { ModelService } from '@services/common/model.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Options } from 'ng5-slider';
import { CommonVerbsApiService } from '@services/common/common-verbs-api.service';
import { Category } from '@models/categories/category.model';
import { PaginatedCollection } from '@models/collection/paginated-collection';
import { debounce } from 'lodash';
import { includes, map, some } from 'lodash';
import { Tag } from '@models/tags/tag.model';
import { CartProduct } from '@models/cart/cart-product.model';
import { alertFire } from '@functions/alerts';
import { Lightbox } from 'ngx-lightbox';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.scss'],
  providers: [
    CollectionService,
    { provide: 'API_SERVICE', useValue: 'cart-products' },
    CommonApiService,
    CommonVerbsApiService
  ],
})
export class CartPageComponent extends CollectionComponent<CartProduct> {
  breadCrumbs = [
    { label: 'Products', active: true },
  ];
  statusControl = new FormControl('0');
  TRANSLATE_KEY = 'ADMIN.USERS.PAGES.LIST.'
  pricevalue = 0;
  maxVal = 240000;
  lastPricevalue: number;
  lastMaxVal: number;
  products = [];
  priceoption: Options = {
    floor: 0,
    ceil: 900000,
    translate: (value: number): string => {
      return '$' + value;
    },
  };
  currentCategory: Category;
  categoriesControl = new FormControl(null);
  categories: Category[] = [];

  currentTag: Tag;
  tagsControl = new FormControl(null);
  tags: Tag[] = [];

  discountControl = new FormControl(null);

  //Local Product Items
  localCartProducts: CartProduct[] = [];
  searchText: string;
  page = 1;
  pageSize = 2;
  totalCartItems = 0;

  //Prices
  totalPrice = 0;

  //Billing
  billingGroup: UntypedFormGroup;
  billingSubmit = false;
  billingDetailsData: any;

  //cupon
  cuponGroup: UntypedFormGroup;
  cuponSubmit = false;

  roleNames: string[] = [];

  private subject$: BehaviorSubject<CartProduct | null> =
    new BehaviorSubject<CartProduct | null>(null);

  constructor(
    router: Router,
    location: Location,
    api: CommonApiService,
    service: CollectionService<CartProduct>,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private apiAuth: AuthenticationApiService,
    @Inject('AuthService')
    public authService: ModelService<CartProduct>,
    @Inject('MenuService')
    public menuService: ModelService<MenuItem[]>,
    private modal: NgbModal,
    public authenticationService: AuthenticationService,
    private api2: CommonVerbsApiService,
    private lightbox: Lightbox,
    private builder: UntypedFormBuilder,
  ) {
    super(
      router,
      location,
      ``,
      api,
      service,
      2,
      { column: 'createdAt', direction: 'DESC' },
      [],
      [
        {
          key: 'users',
          values: [authenticationService?.authService?.model?.id]
        }
      ]
    );
    this.billingGroup = this.builder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required]],
      addressOptional: [''],
      country: ['', [Validators.required]],
      city: ['', [Validators.required]],
      postalCode: ['', [Validators.required]],
      optional: [''],
    });
    this.cuponGroup = this.builder.group({
      code: ['', [Validators.required]],
    });
  }

  get f() {
    return this.billingGroup.controls;
  }

  get fCupon() {
    return this.cuponGroup.controls;
  }

  ngClassValidate(group: UntypedFormGroup, name: string): string {
    if (!this.billingSubmit) return '';
    return group.controls[name].errors ? 'is-invalid' : 'is-valid';
  }

  ngClassValidateCupon(group: UntypedFormGroup, name: string): string {
    if (!this.cuponSubmit) return '';
    return group.controls[name].errors ? 'is-invalid' : 'is-valid';
  }

  ngOnInit(): void {
    super.ngOnInit();
    if (!this.authenticationService?.authService?.model) {
      const cartItemsJSON = localStorage.getItem('cart');
      if (cartItemsJSON) {
        const cartParsed = JSON.parse(cartItemsJSON);
        if (cartParsed.length > 0) {
          this.localCartProducts = cartParsed;
          this.totalCartItems = this.localCartProducts.length;
        }
      }
    }
    this.service.collection$.subscribe(collection => {
      if (this.localCartProducts.length === 0 && collection?.data?.length === 0) {
        this.cuponGroup.get('code').disable();
      }
    });
    this.getPricesData();
    this.checkRole();
  }


  checkRole() {
    const user = this.authenticationService?.authService?.model;
    const roleNames = map(user.roles, r => r.name);
    this.roleNames = roleNames;
  }



  getPricesData() {
    if (!this.authenticationService?.authService?.model) {
      const totalPrice = this.localCartProducts.reduce((total, product) => total + (product.book.price * product.quantity), 0);
      this.totalPrice = totalPrice;
    } else {
      this.api.get<{ data: { totalPrice: number } }>('/prices')
        .subscribe(r => {
          this.totalPrice = r.data.totalPrice;
        })
    }
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


  removeItem(item: CartProduct, index: string) {
    alertFire(`Are you sure you want to remove the item ?`).then(
      result => {
        if (result.value) {
          if (item.id) {
            this.api.delete<any>(`/${item.id}`).subscribe(r => {
              this.toastr.success(r.message);
              this.clear();
              this.getPricesData();
            })
          } else {
            this.localCartProducts.splice(Number(index), 1)
            localStorage.setItem('cart', JSON.stringify(this.localCartProducts));
            this.getPricesData();
            this.toastr.success('Cart Product deleted successfully');
          }
        }
      }
    );
  }


  step = 0;
  billingStep() {
    if (!this.authenticationService?.authService?.model) {
      this.router
        .navigate([`/account/auth/login-2`])
        .then();
    } else {
      this.step = 1;
    }
  }


  ngSubmitBillingDetails() {
    this.billingSubmit = true;
    if (this.billingGroup.valid) {
      alertFire(`Please review the billing details`).then(
        result => {
          if (result.value) {
            const body = this.billingGroup.getRawValue();
            this.billingDetailsData = body;
            this.step = 2;
          }
        });
    }
  }


  validateCupon() {
    this.cuponSubmit = true;
    if (this.cuponGroup.valid) {
      alertFire(`Please review the cupon details`).then(
        result => {
          if (result.value) {
            this.api2.post('cupons/validate').subscribe(r => {
              console.log(r);
            })
          }
        }
      );
    }
  }


  paypal() {
    const params = {
      userId: this.authenticationService.authService.model.id,
      billingDetails: this.billingDetailsData
    }
    this.api2.post<any>('payments/paypal', params).subscribe(r => {
      window.location.href = r;
    });
  }

  mercadoPago() {
    const params = {
      userId: this.authenticationService.authService.model.id,
      billingDetails: this.billingDetailsData
    };
    this.api2.post<any>('payments/mercadopago', params).subscribe(r => {
      window.location.href = r.init_point;
    });
  }

  @ViewChild('payuForm') payuForm: ElementRef;
  payuR: any;
  payuAccountId = environment.payu.accountId;
  payuMerchantId = environment.payu.merchantId;
  payu() {
    const params = {
      userId: this.authenticationService.authService.model.id,
      billingDetails: this.billingDetailsData
    };
    this.api2.post<any>('payments/payu', params).subscribe(r => {
      this.payuR = r;
      setTimeout(() => {
        if (this.payuForm) {
          (this.payuForm.nativeElement as HTMLFormElement).submit();
        }
      }, 300);
    });
  }



  autoFill() {
    this.billingGroup.patchValue({
      firstName: this.authenticationService.authService.model.firstName,
      lastName: this.authenticationService.authService.model.lastName,
      email: this.authenticationService.authService.model.email,
    });
  }

}
