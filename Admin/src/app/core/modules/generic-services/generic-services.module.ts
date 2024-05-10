import { CommonModule } from '@angular/common';
import { Company } from '@models/companies/company.model';
import { ModelService } from '@services/common/model.service';
import { NgModule } from '@angular/core';
import { Tenant } from '@models/tenants/tenant.model';
import { User } from '@models/account/user.model';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [
    {
      provide: 'TenantService',
      useFactory: () => new ModelService<Tenant>(),
    },
    {
      provide: 'UserService',
      useFactory: () => new ModelService<User>(),
    },
    {
      provide: 'CompanyService',
      useFactory: () => new ModelService<Company>(),
    },
  ],
})
export class GenericServicesModule {}
