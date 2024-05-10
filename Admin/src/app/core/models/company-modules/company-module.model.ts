import { Company } from '@models/companies/company.model';
import { ModelBot } from '@models/model-bots/model-bot.model';

export interface CompanyModule {
  id: string;
  company: Company;
  name: string;
  description: string;
  modelBots?: ModelBot[];
}
