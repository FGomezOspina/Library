import { BehaviorSubject, takeUntil } from 'rxjs';
import { Component, Inject } from '@angular/core';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { getMenuByRole, getRouteByRole } from '@functions/routing';

import { ActivatedRoute } from '@angular/router';
import { ApiResponse } from '@models/common/api-response.model';
import { AuthenticationApiService } from '@services/account/authentication-api.service';
import { AuthenticationService } from '@services/account/authentication.service';
import { Category } from '@models/categories/category.model';
import { CollectionComponent } from '@components/abstract/collection.component';
import { CollectionService } from '@services/common/collection.service';
import { CommonApiService } from '@services/common/common-api.service';
import { FormControl } from '@angular/forms';
import { Location } from '@angular/common';
import { MenuItem } from '@models/layout/menu.model';
import { ModelService } from '@services/common/model.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Options } from 'ng5-slider';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from '@models/account/user.model';
import { alertFire } from '@functions/alerts';

@Component({
  selector: 'app-categories-list-page',
  templateUrl: './list-page.component.html',
  providers: [
    CollectionService,
    { provide: 'API_SERVICE', useValue: 'categories' },
    CommonApiService,
  ],
})
export class CategoriesListPageComponent extends CollectionComponent<Category> {
  breadCrumbs = [
    { label: 'Categories', active: true },
  ];
  TRANSLATE_KEY= 'ADMIN.USERS.PAGES.LIST.'


  carouselOption: OwlOptions = {
    items: 4,
    loop: true,
    margin: 40,
    autoplay: true,
    autoplayTimeout: 3000,
    autoplayHoverPause: true,
    nav: false,
    dots: true,
    responsive: {
      0: {
        items: 1,
      },
      480: {
        items: 2,
      },
      768: {
        items: 4,
      },
    },
  }

  private subject$: BehaviorSubject<Category | null> =
    new BehaviorSubject<Category | null>(null);

  constructor(
    router: Router,
    location: Location,
    api: CommonApiService,
    service: CollectionService<Category>,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private modal: NgbModal,
    public authenticationService: AuthenticationService
  ) {
    super(
      router,
      location,
      ``,
      api,
      service,
      10,
      { column: 'createdAt', direction: 'DESC' },
    );
  }

  ngOnInit(): void {
    super.ngOnInit();
  }
}
