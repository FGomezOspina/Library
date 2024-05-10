import { Component, Inject, OnInit } from "@angular/core";

import { CommonApiService } from "@services/common/common-api.service";
import { CommonPageComponent } from "@components/abstract/common-page.component";
import { ModelService } from "@services/common/model.service";
import { map } from 'rxjs/operators';
import { ParamMap } from '@angular/router';
import { of } from 'rxjs';
import { switchMap } from 'rxjs';
import { validate as uuidValidate } from 'uuid';
import { takeUntil } from 'rxjs/operators';
import { tap } from 'rxjs';
import { ActivatedRoute } from "@angular/router";
import { Tag } from "@models/tags/tag.model";

@Component({
  selector: "app-forms-page",
  templateUrl: "./form-page.component.html",
  styleUrls: ["./form-page.component.scss"],
  providers: [
    { provide: 'API_SERVICE', useValue: 'tags' },
    CommonApiService,
    {
      provide: 'TagService',
      useFactory: () => new ModelService<Tag>(),
    },
  ],
})
export class FormPageComponent extends CommonPageComponent implements OnInit {
  constructor(
    private api: CommonApiService,
    @Inject('TagService')
    public tagService: ModelService<Tag>,
    private route: ActivatedRoute
  ) {
    super('Tag', [
      { label: 'tags', route: '../' },
    ]);
  }

  ngOnInit(): void {
    const subscribe = this.route.paramMap
      .pipe(
        map((params: ParamMap) => {
          if (params.get('id') && uuidValidate(params.get('id') || '')) {
            return params.get('id');
          }
          return null;
        }),
        tap(id => {
          if (id) {
            this.breadCrumbs.push({ label: 'Edit', active: true });
          } else {
            this.breadCrumbs.push({ label: 'Create', active: true });
          }
          this.tagService.isLoading = true;
        }),
        switchMap(id => {
          return id
            ? this.api.get<Tag>(`/${id}`, { limit: 50, page: 1 },)
            : of(null);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(model => {
        this.tagService.isLoading = false;
        this.tagService.set(model);
      });
    this.unsubscribe.push(subscribe);
  }
}
