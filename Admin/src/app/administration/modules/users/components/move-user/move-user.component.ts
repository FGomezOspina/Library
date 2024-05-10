import { Component, Inject, Input, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { of, switchMap } from 'rxjs';
import { ApiResponse } from '@models/common/api-response.model';
import { CommonComponent } from '@components/abstract/common-component.component';
import { CommonVerbsApiService } from '@services/common/common-verbs-api.service';
import { Company } from '@models/companies/company.model';
import { ModelService } from '@services/common/model.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PaginatedCollection } from '@models/collection/paginated-collection';
import { User } from '@models/account/user.model';
import { Role } from '@models/account/role.model';
import { ToastrService } from 'ngx-toastr';
import { alertFire } from '@functions/alerts';
import { debounce } from 'lodash';
import { Member } from '@models/account/member.model';

@Component({
  selector: 'app-move-user',
  templateUrl: './move-user.component.html',
  providers: [CommonVerbsApiService],
})
export class MoveUserComponent extends CommonComponent implements OnInit {
  @Input() member!: Member;
TRANSLATE_KEY= 'ADMIN.USERS.COMPONENTS.MOVE.';
  group: UntypedFormGroup = this.builder.group({
    companyId: [null, [Validators.required]],
    roleId: [null, [Validators.required]],
  });
  submit = false;
  companies: Company[] = [];

  constructor(
    private builder: UntypedFormBuilder,

    private api: CommonVerbsApiService,
    @Inject('RolesService')
    public roleService: ModelService<Role[]>,

    public activeModal: NgbActiveModal,
    public toastr: ToastrService
  ) {
    super();
  }

  ngOnInit(): void {
    this.loadRoles();
    this.companySearch({ term: this.member.companyName });
    this.group.patchValue({
      companyId: this.member.companyId,
    });
  }

  ngClassValidate(group: UntypedFormGroup, name: string): string {
    if (!this.submit) return '';
    return group.controls[name].errors ? 'is-invalid' : 'is-valid';
  }
  ngSubmit() {
    this.submit = true;
    if (this.group.valid) {
      alertFire(`Are you sure to make this change?`).then(result => {
        if (result.value) {
          this.api
            .put<ApiResponse>(
              `users/reassign-to-company/${this.member.id}`,
              this.group.getRawValue()
            )
            .subscribe({
              next: () => {
                this.toastr.success('Changes applied.');
                window.location.reload();
              },
              error: e =>
                this.toastr.error(
                  e?.error?.message || e?.message || 'An error occurred.'
                ),
            });
        }
      });
    }
  }

  companySearch = debounce((q: any) => {
    let params: any = {
      page: 1,
      limit: 25,
      orderBy: 'name',
      direction: 'ASC',
    };
    if (q && q.term && q.term.length >= 3) {
      params = {
        ...params,
        q: q.term,
      };
    }
    this.api
      .get<PaginatedCollection<Company>>('companies', params)
      .subscribe(response => {
        this.companies = response.data;
      });
  }, 500);

  private loadRoles() {
    const subscribe = of(this.roleService.model)
      .pipe(
        switchMap(data =>
          data ? of(data) : this.api.get<Role[]>(`users/get-role-list`)
        )
      )
      .subscribe(response => {
        this.roleService.set(response.filter(x => x.name !== 'ADMIN'));
      });
    this.unsubscribe.push(subscribe);
  }
}
