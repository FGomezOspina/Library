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
import { Book } from '@models/books/book.model';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { alertFire } from '@functions/alerts';
import { ApiResponse } from '@models/common/api-response.model';
import { User } from '@models/account/user.model';
import { Lightbox } from 'ngx-lightbox';

@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  providers: [
    CollectionService,
    { provide: 'API_SERVICE', useValue: 'books' },
    CommonApiService,
  ],
})
export class ListPageComponent extends CollectionComponent<Book> {
  breadCrumbs = [
    { label: 'Books', active: true },
  ];
  statusControl = new FormControl('0');
  outOfStockControl = new FormControl('0');
  TRANSLATE_KEY= 'ADMIN.USERS.PAGES.LIST.'
  pricevalue = 10000;
  minVal = 20000;
  maxVal = 240000;
  books = [];
  priceoption: Options = {
    floor: 10000,
    ceil: 300000,
    translate: (value: number): string => {
      return '$' + value;
    },
  };


  private subject$: BehaviorSubject<Book | null> =
    new BehaviorSubject<Book | null>(null);

  constructor(
    router: Router,
    location: Location,
    api: CommonApiService,
    service: CollectionService<Book>,
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
    const subscribe = this.statusControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        const endValue = [value !== '0'];
        this.service.setFilterValue({
          key: 'archivedInd',
          values: endValue,
        });
      });
    this.unsubscribe.push(subscribe);


    const subscribe2 = this.outOfStockControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        const endValue = [value !== '0'];
        this.service.setFilterValue({
          key: 'outOfStock',
          values: endValue,
        });
      });
    this.unsubscribe.push(subscribe2);

    const subscribe1 = this.service.clear$
      .pipe(takeUntil(this.destroy$))
      .subscribe(options => {
        this.statusControl.patchValue('0', {
          emitEvent: false,
        });
        this.outOfStockControl.patchValue('0', {
          emitEvent: false,
        });
      });
    this.unsubscribe.push(subscribe1);
  }


  outOfStockFilter(){
    if(this.outOfStockControl.value === '1'){
      this.outOfStockControl.patchValue('0', {
        emitEvent: true,
      });
    } else {
      this.outOfStockControl.patchValue('1', {
        emitEvent: true,
      });
    }
  }


  deleteBook(id: string) {
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

  unArchive(id: string) {
    alertFire(`Are you sure you want to UNARCHIVE ?`).then(
      result => {
        if (result.value) {
          this.api
            .put<ApiResponse>(`/restore/${id}`)
            .subscribe({
              next: r => {
                this.toastr.success('Changes applied.')
                this.service.init(this.service.options);
              },
              error: e => this.toastr.error(e?.error?.message || 'Changes applied.'),
            });
        }
      }
    );
  }


  archive(id: string) {
    alertFire(`Are you sure you want to archive this book?`).then(
      result => {
        if (result.value) {
          this.api
            .put<ApiResponse>(`/archive/${id}`)
            .subscribe({
              next: r => {
                this.toastr.success('Changes applied.')
                this.service.init(this.service.options);
              },
              error: e => this.toastr.error(e?.error?.message || 'Changes applied.'),
            });
        }
      }
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
}
