import { Component, Inject } from '@angular/core';
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
import { CommonVerbsApiService } from '@services/common/common-verbs-api.service';
import { Category } from '@models/categories/category.model';
import { PaginatedCollection } from '@models/collection/paginated-collection';
import { debounce } from 'lodash';
import { Tag } from '@models/tags/tag.model';

@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styleUrls: ['./list-page.component.scss'],
  providers: [
    CollectionService,
    { provide: 'API_SERVICE', useValue: 'books' },
    CommonApiService,
    CommonVerbsApiService
  ],
})
export class ListPageComponent extends CollectionComponent<Book> {
  breadCrumbs = [
    { label: 'Books', active: true },
  ];
  statusControl = new FormControl('0');
  TRANSLATE_KEY= 'ADMIN.USERS.PAGES.LIST.'
  pricevalue = 0;
  maxVal = 240000;
  lastPricevalue: number;
  lastMaxVal: number;
  books = [];
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
    public authService: ModelService<Book>,
    @Inject('MenuService')
    public menuService: ModelService<MenuItem[]>,
    private modal: NgbModal,
    public authenticationService: AuthenticationService,
    private api2: CommonVerbsApiService,
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

    const routeQueryParams = this.route.snapshot.queryParams;
    if(routeQueryParams?.categoryId){
      this.categoriesControl.patchValue(routeQueryParams?.categoryId);
      this.service.setFilterValue({
        key: 'categories',
        values: [routeQueryParams?.categoryId],
      });
      this.getCategories(routeQueryParams?.categoryId);
    } else {
      this.getCategories();
    }


    if(routeQueryParams?.tagId) {
      this.tagsControl.patchValue(routeQueryParams?.tagId);
      this.service.setFilterValue({
        key: 'tags',
        values: [routeQueryParams?.tagId],
      });
      this.getTags(routeQueryParams?.tagId);
    } else {
      this.getTags();
    }

    const categoriesSubscribe = this.categoriesControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value: any) => {
        if (value) {
          this.service.setFilterValue({
            key: 'categories',
            values: [value],
          });
        } else {
          this.service.removeFilter('categories')
        }
      });
    this.unsubscribe.push(categoriesSubscribe);


    const tagsSubscribe = this.tagsControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value: any) => {
        if (value) {
          this.service.setFilterValue({
            key: 'tags',
            values: [value],
          });
        } else {
          this.service.removeFilter('tags')
        }
      });
    this.unsubscribe.push(tagsSubscribe);

    const discountSubscribe = this.discountControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value: any) => {
        if (value) {
          this.service.setFilterValue({
            key: 'discount',
            values: [value],
          });
        } else {
          this.service.removeFilter('discount')
        }
      });
    this.unsubscribe.push(discountSubscribe);

    const subscribe1 = this.service.clear$
      .pipe(takeUntil(this.destroy$))
      .subscribe(options => {
        this.statusControl.patchValue('0', {
          emitEvent: false,
        });
      });
    this.unsubscribe.push(subscribe1);
  }


  getCategories(setCurrentCatRequest = null){
    const params = {
      page: 1,
      limit: 50
    };
    this.api2.get<PaginatedCollection<Category>>('categories', params)
      .subscribe(r => {
        this.categories = r.data;
        if(setCurrentCatRequest){
          this.currentCategory = this.categories.find(e => e.id === setCurrentCatRequest);
        }
      });
  }


  getTags(setCurrentTagRequest = null){
    const params = {
      page: 1,
      limit: 50
    };
    this.api2.get<PaginatedCollection<Tag>>('tags', params)
      .subscribe(r => {
        this.tags = r.data;
        if(setCurrentTagRequest){
          this.currentTag = this.tags.find(e => e.id === setCurrentTagRequest);
        }
      });
  }


  goToDetails(data: Book) {
    this.router
      .navigate([`detail/${data.id}`], { relativeTo: this.route })
      .then();
  }



  categoryFilter(cat: Category) {
    if (cat.id === this.categoriesControl.value) {
      this.categoriesControl.reset();
      this.currentCategory = null;
    } else {
      this.categoriesControl.patchValue(cat.id);
      this.currentCategory = cat;
    }
  }


  tagFilter(tag: Tag) {
    if (tag.id === this.tagsControl.value) {
      this.tagsControl.reset();
      this.currentTag = null;
    } else {
      this.tagsControl.patchValue(tag.id);
      this.currentTag = tag;
    }
  }


  valueChange = debounce(
    (e) => {
      if(e !== this.lastPricevalue){
        this.lastPricevalue = e;
        this.service.setFilterValue({
          key: 'lowValue',
          values: [this.pricevalue],
        });
      }
    },
    500,
    {}
  );


  highValueChange = debounce(
    (e) => {
      if(e !== this.lastMaxVal){
        this.lastMaxVal = e;
        this.service.setFilterValue({
          key: 'highValue',
          values: [this.maxVal],
        });
      }
    },
    500,
    {}
  );


  discountFilter(e: any, val: number){
    if (e.target.checked) {
      this.discountControl.patchValue(val);
    } else {
      this.discountControl.reset();
    }
  }
}
