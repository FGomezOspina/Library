import { Component, Inject, OnInit } from '@angular/core';
import { AuthenticationService } from '@services/account/authentication.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { CommonApiService } from '@services/common/common-api.service';
import { CommonFormComponent } from '@components/abstract/common-form.component';
import { CommonVerbsApiService } from '@services/common/common-verbs-api.service';
import { ModelService } from '@services/common/model.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { get } from 'lodash';
import { Book } from '@models/books/book.model';
import { Media } from '@models/media/media.model';
import { PaginatedCollection } from '@models/collection/paginated-collection';
import { Category } from '@models/categories/category.model';
import { debounce } from 'lodash';
import { NgxDropzoneChangeEvent } from 'ngx-dropzone';
import { readFile } from '@functions/files';
import { Lightbox } from 'ngx-lightbox';

@Component({
  selector: 'app-edit-form',
  templateUrl: './edit-form.component.html',
  styleUrls: ['./edit-form.component.scss'],
  providers: [
    { provide: 'API_SERVICE', useValue: 'books' },
    CommonApiService,
    CommonVerbsApiService,
  ],
})
export class EditFormComponent
  extends CommonFormComponent<Book, Book>
  implements OnInit {
  editing = false;
  bookId: string | null = null;
  media: Media[] = [];


  updated = false;
  initDataLoaded = false;
  TRANSLATE_KEY = 'MODEL_BOTS.MODULES.CRON-JOBS.COMPONENTS.EDIT-FORM.'

  specificationGroup: UntypedFormGroup;
  featureGroup: UntypedFormGroup;
  sizeGroup: UntypedFormGroup;
  colorGroup: UntypedFormGroup;

  constructor(
    private route: ActivatedRoute,
    @Inject('BookService')
    private bookService: ModelService<Book>,
    builder: UntypedFormBuilder,
    api: CommonApiService,
    toastr: ToastrService,
    private api2: CommonVerbsApiService,
    private router: Router,
    private http: HttpClient,
    public authenticationService: AuthenticationService,
    private lightbox: Lightbox,
  ) {
    super(builder, api, toastr);
    this.group = this.builder.group({
      id: [null],
      title: ['', Validators.required],
      description: ['', [Validators.required]],
      price: [null, [Validators.required]],
      availableQuantity: [null, [Validators.required]],
      discount: [null],
      categories: [[], [Validators.required]],
      tags: [[], [Validators.required]],
      media: [[], [Validators.required]],
      specifications: [[]],
      features: [[]],
      sizes: [[]],
      colors: [[]],
    });


    this.specificationGroup = this.builder.group({
      label: ['', Validators.required],
      value: ['', [Validators.required]],
    });

    this.featureGroup = this.builder.group({
      value: ['', [Validators.required]],
    });
    this.sizeGroup = this.builder.group({
      value: ['', [Validators.required]],
    });
    this.colorGroup = this.builder.group({
      value: ['', [Validators.required]],
    });
  }

  specificationSubmit = false;
  featureSubmit = false;
  sizeSubmit = false;
  colorSubmit = false;

  ngOnInit(): void {
    this.getCategories();
    this.listCatSearch = true;
    this.getTags();
    this.listTagSearch = true;
    const subscribe = this.bookService.model$.subscribe(book => {
      if (book) {
        this.init(book);
      }
      this.initDataLoaded = true;
    });
    this.unsubscribe.push(subscribe);

    const subscribeForm = this.submitEvent.subscribe(model => {
      if (model) {
        this.bookService.set(model);
      }
    });
    this.unsubscribe.push(subscribeForm);
  }


  get f() {
    return this.group.controls;
  }

  get specificationF() {
    return this.specificationGroup.controls;
  }

  get featureF() {
    return this.featureGroup.controls;
  }
  get sizeF() {
    return this.sizeGroup.controls;
  }
  get colorF() {
    return this.colorGroup.controls;
  }


  private init(book: Book) {
    this.editing = true;
    this.bookId = book.id;
    this.media = book.media;
    this.group.patchValue({
      id: book.id,
      title: book.title,
      description: book.description,
      price: book.price,
      discount: book.discount,
      availableQuantity: book.availableQuantity,
      categories: book.categories?.map(e => e.id),
      tags: book.tags?.map(e => e.id),
      media: book.media?.map(e => e.id),
    });
  }


  listCatSearch = false;
  allCategories: Category[];
  categorySearch = null;
  categoriesPage = 1;
  totalCategories: number;
  categoriesPerPage: number;
  private getCategories = debounce(
    () => {
      this.api2
        .get<PaginatedCollection<Category>>(
          'categories',
          {
            page: this.categoriesPage,
            limit: 10,
            orderBy: 'createdAt',
            direction: 'DESC',
            q: this.categorySearch,
          },
          []
        )
        .subscribe(r => {
          this.allCategories = r.data;
          this.totalCategories = r.meta.total;
          this.categoriesPerPage = r.meta.per_page;
        });
    },
    500,
    {}
  );
  onListCategorySearch(q: any) {
    this.categoriesPage = 1;
    this.categorySearch = q.term.toLowerCase();
    this.listCatSearch = true;
    this.getCategories();
  }
  onCatsPageChange(e: any) {
    this.categoriesPage = e;
    this.listCatSearch = true;
    this.getCategories();
  }



  listTagSearch = false;
  allTags: Category[];
  tagSearch = null;
  tagsPage = 1;
  totalTags: number;
  tagsPerPage: number;
  private getTags = debounce(
    () => {
      this.api2
        .get<PaginatedCollection<Category>>(
          'tags',
          {
            page: this.tagsPage,
            limit: 10,
            orderBy: 'createdAt',
            direction: 'DESC',
            q: this.tagSearch,
          },
          []
        )
        .subscribe(r => {
          this.allTags = r.data;
          this.totalTags = r.meta.total;
          this.tagsPerPage = r.meta.per_page;
        });
    },
    500,
    {}
  );
  onListTagSearch(q: any) {
    this.tagsPage = 1;
    this.tagSearch = q.term.toLowerCase();
    this.listTagSearch = true;
    this.getTags();
  }
  onTagsPageChange(e: any) {
    this.tagsPage = e;
    this.listTagSearch = true;
    this.getTags();
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


  onSelect(event: NgxDropzoneChangeEvent) {
    const file = event.addedFiles[0];
    if (file) {
      readFile(file).then(() => {
        const subscribe = this.api
          .form<Media[]>(`media/upload`, {
            file: file,
            source: 'BOOK',
            bytesSize: file.size
          })
          .subscribe(
            r => {
              this.group.patchValue({
                media: [...this.group.get('media').value, r[0].id]
              });
              this.media.unshift(r[0]);
            },
            error => {
              this.toastr.error(error?.error?.message || 'An error occurred.');
            }
          );
        this.unsubscribe.push(subscribe);
      });
    }
  }


  dettachMedia(media: Media, index: number) {
    const mediaForm = this.group.get('media').value;
    const formIndex = mediaForm.findIndex(e => e.id === media.id);
    mediaForm.splice(formIndex, 1);
    this.group.patchValue({
      media: mediaForm
    });
    this.media.splice(Number(index), 1);
  }





  override ngSubmit(): void {
    this.submit = true;
    if (this.group.valid) {
      const body = this.group.getRawValue();
      body.uploadByUserId = this.authenticationService.authService.model.id;
      const id = get(body, 'id', null);
      let subscribe: Observable<any>;
      let path = '/';
      if (id !== null) {
        path += `${id}`;
        subscribe = this.api.put<Book>(path, body);
      } else {
        subscribe = this.api.post<Book>(path, body);
      }
      subscribe.subscribe({
        complete: () => (this.submit = false),
        error: err => {
          this.toastr.error(
            err?.error?.message || err?.message || 'An error occurred.'
          );
        },
        next: response2 => {
          this.toastr.success('Changes applied.');
          this.subject$.next(response2);
          this.submitEvent.emit(response2);
          if (this.isCreateSubject$.value) {
            this.group.reset();
          }
          this.router.navigate([`admin/books`]);
        },
      });
    }
  }
}
