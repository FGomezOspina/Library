import { AbstractControl } from '@angular/forms';
import { CommonApiService } from '@services/common/common-api.service';
import { CommonComponent } from '@components/abstract/common-component.component';
import { Company } from '@models/companies/company.model';
import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Inject } from '@angular/core';
import { Input } from '@angular/core';
import { ModelService } from '@services/common/model.service';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { OnInit } from '@angular/core';
import { Role } from '@models/account/role.model';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UntypedFormArray } from '@angular/forms';
import { UntypedFormBuilder } from '@angular/forms';
import { UntypedFormGroup } from '@angular/forms';
import { User } from '@models/account/user.model';
import { Validators } from '@angular/forms';
import { get } from 'lodash';

@Component({
  selector: 'app-general-form',
  templateUrl: './general-form.component.html',
})
export class GeneralFormComponent extends CommonComponent implements OnInit {
  @Input() formType!: string;

  TRANSLATE_KEY= 'ADMIN.USERS.COMPONENTS.GENERAL-F.';
  group: UntypedFormGroup = this.builder.group({
    id: [null, []],
    firstName: [null, [Validators.required, Validators.minLength(3)]],
    lastName: [null, [Validators.required, Validators.minLength(3)]],
    email: [null, [Validators.required, Validators.email]],
    roles: [null, [Validators.required]],
    profile: this.builder.group({
      about: [null, []],
      birthdate: [null, []],
      gender: [null, []],
      nickname: [null, []],
      phoneNumber: [null, []],
      preferredName: [null, []],
    }),
  });
  formMode = 'create';
  submit = false;
  model!: User;
  birthDate!: NgbDate;
  isAdminUser = false;
  genderOptions = [
    { name: 'Male', value: 'MALE' },
    { name: 'Female', value: 'FEMALE' },
  ];

  roleOptions: Role[] = [];

  get f() {
    return this.group.controls;
  }

  innerControls(name: string) {
    const group = this.group.get(name) as UntypedFormArray;
    return group.controls;
  }

  constructor(
    private builder: UntypedFormBuilder,
    @Inject('UserService')
    public userService: ModelService<User>,
    @Inject('CompanyService')
    public companyService: ModelService<Company>,
    public api: CommonApiService,
    private router: Router,
    private toastr: ToastrService
  ) {
    super();
  }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {
    const subscribe = this.userService.model$.subscribe(value => {
      if (value != null) {
        const roleList = this.api
          .get<Role[]>('/get-role-list')
          .subscribe((r: Role[]) => {
            this.roleOptions = r;
            this.load(value);
            if (Object.keys(value).length > 0) {
              this.group.controls['email'].disable();
              // this.group.controls['roles'].disable();
            }
          });
        this.unsubscribe.push(roleList);
      }
    });
    this.unsubscribe.push(subscribe);
  }

  ngSubmit(): void {
    this.submit = true;
    if (this.group.valid) {
      const body = this.group.getRawValue();
      body.role = body.roles[0].name;
      delete body.roles;
      const id = get(body, 'id', null);
      let subscribe: Observable<User>;
      if (!this.isAdminUser) {
        body.companyId = this.companyService.model?.id;
      }
      const userPath = this.isAdminUser ? 'create-admin' : 'create-internal';
      if (id) {
        subscribe = this.api.put(`/${id}`, body);
      } else {
        subscribe = this.api.post(`/${userPath}`, body);
      }
      subscribe.subscribe(
        () => {
          this.toastr.success('New user created.');
          if (this.isAdminUser) {
            this.router.navigate(['admin', 'users']).then();
          } else {
            this.router
              .navigate([
                'companies',
                this.companyService.model?.id,
                'members',
              ])
              .then();
          }
        },
        e => {
          const emailErrors = get(e.error.errors, 'email', null);
          if (emailErrors !== null) {
            this.group.controls['email'].setErrors({
              incorrect: true,
              message: emailErrors[0],
            });
          }
          this.toastr.error(e?.error.message || 'Changes applied.');
        }
      );
    }
  }

  ngClassGroupValidate(
    group: FormGroup | AbstractControl<User>,
    name: string
  ): string {
    if (!this.submit) return '';
    const control = (group as FormGroup).controls[name];
    return control.errors ? 'is-invalid' : 'is-valid';
  }

  ngClassValidate(group: UntypedFormGroup, name: string): string {
    if (!this.submit) return '';
    const fieldName = name.split('.');
    if (fieldName.length > 1) {
      const profile = group.controls[fieldName[0]] as FormGroup;
      const field = fieldName[1];
      return profile.controls[field].errors ? 'is-invalid' : 'is-valid';
    } else {
      return group.controls[fieldName[0]].errors ? 'is-invalid' : 'is-valid';
    }
  }

  private load(model: User) {
    if (Object.keys(model).length === 0) {
      if (this.formType === 'admin') {
        this.isAdminUser = true;
        this.group.controls['roles'].setValue(
          this.roleOptions.filter((r: Role) => r.name === 'ADMIN')
        );
      } else {
        this.group.controls['roles'].setValue(
          this.roleOptions.filter((r: Role) => r.name === 'READ_USER')
        );
      }
      // this.group.controls['roles'].disable();
    } else {
      this.isAdminUser = false;
      this.group.patchValue(model);
      if (model.roles) {
        model.roles.map((role: Role) => {
          if (this.isAdminUser === false) {
            if (role.name === 'ADMIN') {
              this.isAdminUser = true;
            }
          }
        });
      }
      if (model.profile?.birthdate) {
        const myDate = new Date(model.profile.birthdate);
        this.birthDate = new NgbDate(
          Number(myDate.getFullYear()),
          Number(myDate.getMonth()) + 1,
          Number(myDate.getDate())
        );
      }
    }
  }
}
