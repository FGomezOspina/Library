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
import { Tag } from '@models/tags/tag.model';
@Component({
  selector: 'app-edit-form',
  templateUrl: './edit-form.component.html',
  styleUrls: ['./edit-form.component.scss'],
  providers: [
    { provide: 'API_SERVICE', useValue: 'tags' },
    CommonApiService,
    CommonVerbsApiService,
  ],
})
export class EditFormComponent
  extends CommonFormComponent<Tag, Tag>
  implements OnInit {
  editing = false;
  tagId: string | null = null;
  media: Media[] = [];


  updated = false;
  initDataLoaded = false;
  TRANSLATE_KEY = 'MODEL_BOTS.MODULES.CRON-JOBS.COMPONENTS.EDIT-FORM.'

  constructor(
    private route: ActivatedRoute,
    @Inject('TagService')
    private tagService: ModelService<Tag>,
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
    });
  }

  ngOnInit(): void {
    const subscribe = this.tagService.model$.subscribe(tag => {
      if (tag) {
        this.init(tag);
      }
      this.initDataLoaded = true;
    });
    this.unsubscribe.push(subscribe);

    const subscribeForm = this.submitEvent.subscribe(model => {
      if (model) {
        this.tagService.set(model);
      }
    });
    this.unsubscribe.push(subscribeForm);
  }


  get f() {
    return this.group.controls;
  }

  private init(tag: Tag) {
    this.editing = true;
    this.tagId = tag.id;
    this.group.patchValue({
      id: tag.id,
      title: tag.title,
      description: tag.description,
    });
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
        subscribe = this.api.put<Tag>(path, body);
      } else {
        subscribe = this.api.post<Tag>(path, body);
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
          this.router.navigate([`admin/tags`]);
        },
      });
    }
  }
}
