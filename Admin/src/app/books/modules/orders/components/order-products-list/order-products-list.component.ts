import { Component, Inject } from '@angular/core';
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
import { FormControl } from '@angular/forms';
import { Options } from 'ng5-slider';
import { CommonVerbsApiService } from '@services/common/common-verbs-api.service';
import { Category } from '@models/categories/category.model';
import { PaginatedCollection } from '@models/collection/paginated-collection';
import { debounce, map } from 'lodash';
import { Tag } from '@models/tags/tag.model';
import { OrderProduct } from '@models/order-products/order-product.model';
import { Lightbox } from 'ngx-lightbox';

@Component({
  selector: 'app-order-products-list',
  templateUrl: './order-products-list.component.html',
  providers: [
    CollectionService,
    { provide: 'API_SERVICE', useValue: 'order-products' },
    CommonApiService,
    CommonVerbsApiService
  ],
})
export class OrderProductsComponent extends CollectionComponent<OrderProduct> {
  breadCrumbs = [
    { label: 'Order Products', active: true },
  ];
  TRANSLATE_KEY= 'ADMIN.USERS.PAGES.LIST.'
  products = [];


  roleNames: string[] = [];

  private subject$: BehaviorSubject<OrderProduct | null> =
    new BehaviorSubject<OrderProduct | null>(null);

  constructor(
    router: Router,
    location: Location,
    api: CommonApiService,
    service: CollectionService<OrderProduct>,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private apiAuth: AuthenticationApiService,
    @Inject('AuthService')
    public authService: ModelService<OrderProduct>,
    @Inject('MenuService')
    public menuService: ModelService<MenuItem[]>,
    private modal: NgbModal,
    public authenticationService: AuthenticationService,
    private api2: CommonVerbsApiService,
    private lightbox: Lightbox,
  ) {
    console.log(route);

    super(
      router,
      location,
      ``,
      api,
      service,
      10,
      { column: 'createdAt', direction: 'DESC' },
      [],
      [
        {
          key: 'orders',
          values: [route.snapshot.params.id]
        }
      ]
    );
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


  ngOnInit(): void {
    super.ngOnInit();
    this.checkRole();

  }

  checkRole(){
    const user = this.authenticationService?.authService?.model;
    console.log(user);
    const roleNames = map(user.roles, r => r.name);
    console.log(roleNames, user);
    this.roleNames = roleNames;
  }

  goToDetails(data: OrderProduct) {
    this.router
      .navigate([`detail/${data.id}`], { relativeTo: this.route })
      .then();
  }
}
