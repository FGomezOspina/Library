import { CompanyModule } from '@models/company-modules/company-module.model';
import { DataSet } from '@models/data-sets/data-set.model';
import { Media } from '@models/media/media.model';
import { Staff } from '@models/companies/staff.model';
import { User } from '@models/account/user.model';
import { YoutubeVideo } from '@models/media/youtube-video.model';

export interface ModelBot {
  id: string;
  name: string;
  timezone: string;
  description: string;
  parentEntity: CompanyModule | User;
  parentEntityType: string;
  storageLimit: number;
  contextLimit: number;
  lastMedia: Media[];
  lastDataSets: DataSet[];
  lastYoutubeVideos: YoutubeVideo[];
  dataSets?: DataSet[];
  admins?: Staff[];
}
