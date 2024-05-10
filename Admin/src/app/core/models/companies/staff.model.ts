import { Role } from '@models/account/role.model';

export interface Staff {
  email: string;
  firstName: string;
  id: string;
  lastName: string;
  name: string;
  roles: Role[];
}
