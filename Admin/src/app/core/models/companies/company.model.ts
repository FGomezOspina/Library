import { CompanyModule } from '@models/company-modules/company-module.model';
import { Media } from '@models/media/media.model';
import { Staff } from './staff.model';
import { Tenant } from '../tenants/tenant.model';
import { User } from '@models/account/user.model';

export interface Company {
  data: [];
  admins: Staff[];
  tenant: Tenant;
  id: string;
  name: string;
  logoMedia?: Media;
  members?: User[];
  timezone?: string;
  companyModules?: CompanyModule[];
}
