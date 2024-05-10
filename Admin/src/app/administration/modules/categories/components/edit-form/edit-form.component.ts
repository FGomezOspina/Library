import { Component, Inject, OnInit } from '@angular/core';
import { AuthenticationService } from '@services/account/authentication.service';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { CommonApiService } from '@services/common/common-api.service';
import { CommonFormComponent } from '@components/abstract/common-form.component';
import { CommonVerbsApiService } from '@services/common/common-verbs-api.service';
import { ModelService } from '@services/common/model.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { get } from 'lodash';
import { Media } from '@models/media/media.model';
import { Category } from '@models/categories/category.model';
import { NgxDropzoneChangeEvent } from 'ngx-dropzone';
import { readFile } from '@functions/files';
@Component({
  selector: 'app-edit-form',
  templateUrl: './edit-form.component.html',
  styleUrls: ['./edit-form.component.scss'],
  providers: [
    { provide: 'API_SERVICE', useValue: 'categories' },
    CommonApiService,
    CommonVerbsApiService,
  ],
})
export class EditFormComponent
  extends CommonFormComponent<Category, Category>
  implements OnInit {
  editing = false;
  categoryId: string | null = null;

  categoryLogo: Media = {
    url: null,
    file: null,
    reference: 'logoMedia',
  };

  updated = false;
  initDataLoaded = false;
  TRANSLATE_KEY = 'MODEL_BOTS.MODULES.CRON-JOBS.COMPONENTS.EDIT-FORM.'

  constructor(
    private route: ActivatedRoute,
    @Inject('CategoryService')
    private categoryService: ModelService<Category>,
    builder: UntypedFormBuilder,
    api: CommonApiService,
    toastr: ToastrService,
    private api2: CommonVerbsApiService,
    private router: Router,
    private http: HttpClient,
    public authenticationService: AuthenticationService,
  ) {
    super(builder, api, toastr);
    this.group = this.builder.group({
      id: [null],
      title: ['', Validators.required],
      description: ['', [Validators.required]],
      logoMediaId: ['']
    });
  }

  ngOnInit(): void {
    const subscribe = this.categoryService.model$.subscribe(category => {
      if (category) {
        this.init(category);
      }
      this.initDataLoaded = true;
    });
    this.unsubscribe.push(subscribe);

    const subscribeForm = this.submitEvent.subscribe(model => {
      if (model) {
        this.categoryService.set(model);
      }
    });
    this.unsubscribe.push(subscribeForm);
  }


  get f() {
    return this.group.controls;
  }

  private init(category: Category) {
    this.editing = true;
    if (category.logoMedia !== null) {
      this.categoryLogo = { ...this.categoryLogo, ...category.logoMedia };
    }
    this.categoryId = category.id;
    this.group.patchValue({
      id: category.id,
      title: category.title,
      description: category.description,
    });
  }


  onSelect(event: NgxDropzoneChangeEvent, media: Media) {
    media.file = event.addedFiles[0];
    if (media.file) {
      readFile(media.file).then(() => {
        media.url = null;
        const subscribe = this.api
          .form<Media[]>(`media/upload`, {
            file: media.file,
            categoryId: this.categoryId,
            source: 'CATEGORY',
            bytesSize: media.file.size
          })
          .subscribe(
            r => {
              this.group.patchValue({
                logoMediaId: r[0].id,
              });
            },
            error => {
              this.toastr.error(error?.error?.message || 'An error occurred.');
            }
          );
        this.unsubscribe.push(subscribe);
      });
    }
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
        subscribe = this.api.put<Category>(path, body);
      } else {
        subscribe = this.api.post<Category>(path, body);
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
          this.router.navigate([`admin/categories`]);
        },
      });
    }
  }
}
