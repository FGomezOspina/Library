import { ModelBot } from '@models/model-bots/model-bot.model';
import { Profile } from '@models/account/profile.model';
import { Role } from './role.model';
import { RoleEntity } from './role-entity.model';
import { Subscription } from '@models/subscriptions/subscription.model';
import { Tenant } from '@models/tenants/tenant.model';
import { UserCompanyModule } from './user-company-module.model';

export interface User {
  id: string;
  name?: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  emailVerifiedAt: null;
  emailConfirmedAt?: Date;
  rememberToken: string;
  updatedAt: Date;
  createdAt: Date;
  roles: RoleEntity[];
  deletedAt: null;
  profile?: Profile;
  userId?: string;
  roleNames: string[];
  data: [];
  medias?: number;
  modelBot?: ModelBot;
  tenants?: Tenant[];
  companyModules?: UserCompanyModule[];
  subscription?: Subscription;
  apiBalanceValue?: number;
}
