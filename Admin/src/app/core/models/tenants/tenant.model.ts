import { Company } from '@models/companies/company.model';
import { Media } from '@models/media/media.model';
import { User } from '@models/account/user.model';

export interface Tenant {
  id: string;
  name: string;
  description?: string;
  logoMedia: Media | null;
  companies: Company[];
  admins: User[];
}
