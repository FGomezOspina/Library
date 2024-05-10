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
import Swal, { SweetAlertResult } from 'sweetalert2';
import { alertFire } from '@functions/alerts';
import { ApiResponse } from '@models/common/api-response.model';
import { Category } from '@models/categories/category.model';
import { User } from '@models/account/user.model';
import { Lightbox } from 'ngx-lightbox';

@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  providers: [
    CollectionService,
    { provide: 'API_SERVICE', useValue: 'categories' },
    CommonApiService,
  ],
})
export class ListPageComponent extends CollectionComponent<Category> {
  breadCrumbs = [
    { label: 'Categories', active: true },
  ];
  TRANSLATE_KEY= 'ADMIN.USERS.PAGES.LIST.'



  private subject$: BehaviorSubject<Category | null> =
    new BehaviorSubject<Category | null>(null);

  constructor(
    router: Router,
    location: Location,
    api: CommonApiService,
    service: CollectionService<Category>,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private apiAuth: AuthenticationApiService,
    @Inject('AuthService')
    public authService: ModelService<User>,
    @Inject('MenuService')
    public menuService: ModelService<MenuItem[]>,
    private modal: NgbModal,
    public authenticationService: AuthenticationService,
    private lightbox: Lightbox,
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

  deleteCat(id: string) {
    Swal.fire({
      title: 'Are you sure you want to delete?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#07B59A',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result: SweetAlertResult) => {
      if (result.value) {
        this.api.delete(`/${id}`).subscribe(
          () => {
            this.toastr.success('Changes applied.');
            this.service.init(this.service.options);
          },
          e => {
            this.toastr.error(e?.error.message || 'Changes applied.');
          }
        );
      }
    });
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


}
